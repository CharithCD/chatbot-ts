import { NextResponse } from "next/server";

export async function GET() {
    try{
        const res = NextResponse.json({message: "Logout successful!", status: 200});
        res.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        return res;
    }catch(err){
        return NextResponse.json({message: "Something went wrong!", status: 500});
    }
}