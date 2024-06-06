import { z } from "zod";

// Define the Zod schema for login
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// Define the Zod schema for register
const signupSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

const businessSchema = z.object({
    _id: z.string(),
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    website: z.string(),
    description: z.string(),
});


export { loginSchema, signupSchema, businessSchema };