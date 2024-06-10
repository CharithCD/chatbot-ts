import dbConnect from "@/dbConfig/dbconfig";
import { getTokenData } from "@/helper/tokenData";
import { Business } from "@/models/business.model";
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone';
import { z } from "zod";
import ApiError from "@/helper/ApiError";
import OpenAI from "openai";

type FAQ = {
    _id: string;
    question: string;
    answer: string;
};

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { id, businessId } = await getTokenData(req);
        const userId = id;

        const business = await Business.findOne({ _id: businessId, owner: userId });

        if (!business) {
            return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
        }

        const { description, faq, name, email, phone, address, website } = business;
        const metadata = `Business Name: ${name}, Email: ${email}, Phone: ${phone}, Address: ${address}, Website: ${website}`;

        // Concatenate metadata with each text
        const texts = [description, ...faq.map((f: FAQ) => `${f.question} ${f.answer}`)];
        const textsWithMetadata = texts.map(text => `${metadata}, ${text}`);

        const pc = process.env.PINECONE_API_KEY ? new Pinecone({ apiKey: process.env.PINECONE_API_KEY }) : null;
        if (!pc) {
            return NextResponse.json({ error: 'Pinecone API key is not set' }, { status: 500 });
        }

        const index = pc.index("querymate");
        const openai = new OpenAI();

        const embeddings = await Promise.all(
            textsWithMetadata.map(async (text) => {
                const response = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: text,
                    encoding_format: "float",
                });
                // Log the text and its embedding to ensure they are correct
                console.log(`Text: ${text}`);
                console.log(`Embedding: ${response.data[0].embedding}`);
                return {
                    text, // Keep original text for metadata
                    embedding: response.data[0].embedding
                };
            })
        );

        const upserts = embeddings.map((embeddingObj, idx) => ({
            id: `${businessId}_${idx}`,
            values: embeddingObj.embedding,
            metadata: {
                businessId: business._id.toString(),
                text: embeddingObj.text // Ensure this is correctly set
            },
        }));

        // Log the upserts to verify before sending to Pinecone
        console.log("Upserts: ", JSON.stringify(upserts, null, 2));

        await index.namespace("ns1").upsert(upserts);

        return NextResponse.json({ message: "Chat-bot trained successfully !!!", status: 201 });

    } catch (error) {
        console.log("Error: ", error);
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
