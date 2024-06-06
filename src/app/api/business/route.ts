import ApiError from "@/helper/ApiError";
import { getTokenData } from "@/helper/tokenData";
import { Business } from "@/models/business.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



export async function POST(req: NextRequest) {
    try {
        const { id } = await getTokenData(req);
        const userId = id;

        const { name, description, email, phone, address, website } = await req.json();

        const business = await Business.create({
            owner: userId,
            name,
            description,
            email,
            phone,
            address,
            website
        });

        if (!business) {
            return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
        }

        return NextResponse.json({ message: "Business created successfully", status: 201, data: business });

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

export async function GET(req: NextRequest) {
    try {
        const { id } = await getTokenData(req);
        const userId = id;
        if (!userId) {
            return NextResponse.json({ error: 'You are not logged in!' }, { status: 400 });
        }

        const business = await Business.findOne({ owner: userId }).select(
            "_id owner name description email phone address website"
        );

        if (!business) {
            return NextResponse.json({ error: 'Business does not exist!' }, { status: 404 });
        }

        if (business.owner.toString() !== userId.toString()) {
            return NextResponse.json({ error: 'You are not authorized to view this business!' }, { status: 401 });
        }

        return NextResponse.json({ message: "Businesses fetched successfully", status: 200, data: business });

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

export async function PUT(req: NextRequest) {
    try {
        const { id } = await getTokenData(req);
        const userId = id;

        const { _id, name, description, email, phone, address, website } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'You are not logged in!' }, { status: 401 });
        }

        const business = await Business.findById(_id);

        if (!business) {
            return NextResponse.json({ error: 'Business does not exist!' }, { status: 404 });
        }

        if (business.owner.toString() !== userId.toString()) {
            return NextResponse.json({ error: 'You are not authorized to edit this business!' }, { status: 401 });
        }

        business.name = name;
        business.description = description;
        business.email = email;
        business.phone = phone;
        business.address = address;
        business.website = website;

        const updatedBusiness = await business.save();

        if (!updatedBusiness) {
            return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
        }

        return NextResponse.json({ message: "Business updated successfully", status: 200, data: updatedBusiness });

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