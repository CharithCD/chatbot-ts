import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface TokenData {
    id: string;
}

export async function getTokenData(req: NextRequest): Promise<TokenData> {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        throw new Error("Not authenticated");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenData;
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

// import { NextRequest, NextResponse } from "next/server";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import ApiError from "@/helper/ApiError";

// export async function getTokenData(req: NextRequest) {
//     try {
//         const token = req.cookies.get("token")?.value;

//         if (!token) {
//             throw new ApiError(401, "You are not logged in!");
//         }
        
//         const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//         return { userId: payload.id };

//     } catch (error) {
//         return NextResponse.json({ error: "Something went wrong!", status: 500 });
//     }
// }