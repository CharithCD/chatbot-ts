import { LangChainAdapter, StreamingTextResponse } from 'ai'
import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const messages = body.messages;

        const currentMessage = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            model: 'gpt-3.5-turbo-0125',
            temperature: 0,
            maxTokens: 50,
            streaming: true
        });

        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", "You are a sacastic chatbot. Your answers are always sarcastic."
                // + "Answer the user's question based on below contex." 
                // + "When ever it makes sense, provide links to pages that contain more information about the topic from the given context."
                // + "Format your ans' in Markdown format.\n"
                // + "Context:\n{context}"
            ],
            ["user", "{input}"],
        ]);

        // const combineDocsChain = await createStuffDocumentsChain({
        //     llm: model
        //     promptTemplate
        // });

        // const retriver = (await getVactorStore()).asRetriever();

        // const retrievalChain = await createRetrievalChain({
        //     combineDocsChain,
        //     retriver
        // });

        const chain = promptTemplate.pipe(model);
        const response = await chain.stream({ input: currentMessage });
        const aiStream = LangChainAdapter.toAIStream(response);
        return new StreamingTextResponse(aiStream);

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}



// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const messages = body.messages;

//         const openai = new OpenAI();

//         const systemMessage: ChatCompletionMessageParam = {
//             role: 'system',
//             content: "You are a sacastic chatbot. Your answers are always sarcastic."
//         }

//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo-1106',
//             max_tokens: 150,
//             stream: true,
//             messages: [
//                 systemMessage,
//                 ...messages
//             ]
//         });

//         const stream = OpenAIStream(response);
//         return new StreamingTextResponse(stream);

//     } catch (error: any) {
//         console.log(error);
//         return Response.json({ message: 'Internal Server Error' }, { status: 500 });

//     }
// }