import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/dbConfig/dbconfig.js";
import ApiError from "@/helper/ApiError";
import { Business } from "@/models/business.model";
import { z } from "zod";
import { signupSchema } from "@/types/zodSchemas";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { name, email, password } = signupSchema.parse(body);

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        const business = new Business({
            owner: newUser._id,
            name: newUser.name,
            email: newUser.email,
        })
        await business.save({ validateBeforeSave: false });
        
        // Send verification email

        //if verified

        return NextResponse.json({ message: "Signup successfully", status: 201 });
        //return NextResponse.json({ message: "Signup successfully", status: 201, data: newUser });

    } catch (error) {
        console.log(error)
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