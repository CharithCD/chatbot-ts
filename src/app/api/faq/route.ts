import dbConnect from "@/dbConfig/dbconfig";
import ApiError from "@/helper/ApiError";
import { getTokenData } from "@/helper/tokenData";
import { Business } from "@/models/business.model";
import { businessSchema, faqSchema } from "@/types/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { id } = await getTokenData(req);
        const userId = id;
        if (!userId) {
            return NextResponse.json({ error: 'You are not logged in!' }, { status: 400 });
        }

        const business = await Business.findOne({ owner: userId });
        if (!business) {
            return NextResponse.json({ error: 'Business does not exist!' }, { status: 404 });
        }

        if (business.owner.toString() !== userId.toString()) {
            return NextResponse.json({ error: 'You are not authorized to view this business!' }, { status: 401 });
        }

        const faqs = business.faq || []; // Assuming faq field exists and is an array

        return NextResponse.json({ message: "FAQs fetched successfully", status: 200, data: faqs });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((err) => err.message).join(", ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        } else if (error instanceof ApiError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode })
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { id } = await getTokenData(req);
        const userId = id;

        const body = await req.json();
        faqSchema.parse(body);
        const { question, answer } = body;
        const business = await Business.findOne({ owner: userId });
        if (!business) {
            return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
        }

        business.faq.push({ question, answer });
        await business.save();

        return NextResponse.json({ message: "FAQ added successfully", status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((err) => err.message).join(", ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        } else if (error instanceof ApiError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode })
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }
}

type FAQ = {
    _id: string;
    question: string;
    answer: string;
};
export async function DELETE(req: NextRequest) {
    await dbConnect();
    try {
        const { id, businessId } = await getTokenData(req);
        const userId = id;

        const { faqId } = await req.json();

        const business = await Business.findOne({ _id: businessId, owner: userId });

        if (!business) {
            return NextResponse.json({ error: 'Business not found or you are not authorized to delete FAQs for this business.' }, { status: 404 });
        }

        business.faq = business.faq.filter((faq:FAQ) => faq._id.toString() !== faqId);

        await business.save();

        return NextResponse.json({ message: 'FAQ deleted successfully.', status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map((err) => err.message).join(", ");
            return NextResponse.json({ message: errorMessage }, { status: 400 });
        } else if (error instanceof ApiError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode })
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    }
}

