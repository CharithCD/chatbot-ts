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
    _id: z.string().min(1, { message: "ID is required" }),
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(100, { message: "Name must be at most 100 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    description: z.string()
        .min(300, { message: "Description must be at least 300 characters long" })
        .max(4500, { message: "Description must be at most 4500 characters long" }),
});


export { loginSchema, signupSchema, businessSchema };