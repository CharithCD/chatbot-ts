'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import React from "react"
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/types/zodSchemas";


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    const showErrorToast = (description: string) => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description,
        });
    };

    const showSuccessToast = (description: string) => {
        toast({
            description,
        });
    };


    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            const response = await axios.post("/api/auth/login", values);
            console.log(response);
            console.log(response.status);
            if (response.status >= 200 && response.status < 300) {
                router.push("/dashboard");
                showSuccessToast("Login successful!");
            } else {
                showErrorToast("Login failed. Please try again.");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                const errorMessage = data?.error || "An error occurred during login";
                showErrorToast(errorMessage);
            } else if (error instanceof z.ZodError) {
                error.errors.forEach(errorItem => {
                    const field = errorItem.path.join('.');
                    form.setError(field as keyof z.infer<typeof loginSchema>, {
                        type: "server",
                        message: errorItem.message,
                    });
                });
            } else {
                showErrorToast("An unexpected error occurred during login");
            }
        }
    }

    return (
        <>
            <div className="min-h-screen">
                <header className="p-6 max-w-screen-xl px-12 mx-auto mt-4 md:mt-0 lg:px-0">
                    <div className="flex px-4 py-2">
                        <Link href={'/'} className="font-bold text-primary">Query Mate</Link>
                    </div>
                </header>

                <div className="w-full mt-14 mx-auto flex justify-center items-center px-8 md:px-0">
                    <div>
                        <Card className="mx-auto max-w-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl">Login</CardTitle>
                                <CardDescription>
                                    Enter your email below to login to your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="sample@email.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" /> Please wait...
                                                </>
                                            ) : (
                                                "Login"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="underline">
                                        Sign up
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

        </>
    );
}
