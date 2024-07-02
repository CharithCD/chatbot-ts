import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from 'zod';
import ApiError from '@/helper/ApiError';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { getTokenData } from '@/helper/tokenData';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body);
        const messages = body.messages;
        const { businessId } = await getTokenData(request);

        const currentMessage = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            model: 'gpt-3.5-turbo-0125',
            temperature: 0,
            maxTokens: 150,
            streaming: true
        });



        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system",
                "You are an assistant. Answer the user's question based only on the context provided below. " +
                "Provide links to pages with more information about the topic when it makes sense. " +
                "Format your answers in Markdown format.\n" +
                "Context:\n{context}"
            ],
            ["user", "{input}"],
        ]);

        const openai = new OpenAI();
        const inputEmbedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: currentMessage,
            encoding_format: "float",
        });

        const pc = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;
        if (!pc) {
            return NextResponse.json({ error: 'Pinecone API key is not set' }, { status: 500 });
        }
        const index = pc.index("querymate");
        const queryResponse1 = await index.namespace("ns1").query({
            topK: 3,
            vector: inputEmbedding.data[0].embedding,
            includeValues: true,
            includeMetadata: true // Ensure metadata is included
        });

        const filteredResults = queryResponse1.matches.filter(
            (match) => match && match.metadata && match.metadata.businessId === businessId
        );


        const context = filteredResults.map(result => {
            if (result && result.metadata && result.metadata.text) {
                return result.metadata.text;
            }
            return '';
        }).join("\n\n");

        const chain = promptTemplate.pipe(model);
        const response = await chain.stream({ input: currentMessage, context: context });
        const aiStream = LangChainAdapter.toAIStream(response);
        return new StreamingTextResponse(aiStream);

    } catch (error) {
        console.log("Error:", error);
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((err) => err.message).join(", ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        } else if (error instanceof ApiError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
}
