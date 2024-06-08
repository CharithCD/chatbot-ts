"use client";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { businessSchema } from '@/types/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Page = (): JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const form = useForm<formData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      _id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      description: "",
    },
  });

  useEffect(() => {
    if (hasFetched) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/business`);
        const businessData = response.data.data;
        form.reset(businessData);
        setHasFetched(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching business data",
          description: "Could not fetch business data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, toast, hasFetched]);

  type formData = z.infer<typeof businessSchema>;

  const onSubmit = async (values: formData) => {
    try {
      const response = await axios.put("/api/business", values);
      if (response.status >= 200 && response.status < 300) {
        router.push("/dashboard/business");
        toast({
          description: "Update successful!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed. Please try again.",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        const errorMessage = data?.error || "An error occurred during updating";
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
        });
      } else if (error instanceof z.ZodError) {
        error.errors.forEach(errorItem => {
          const field = errorItem.path.join('.');
          form.setError(field as keyof formData, {
            type: "server",
            message: errorItem.message,
          });
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "An unexpected error occurred during updating",
        });
      }
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Business</h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className='p-8 w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className='grid md:grid-cols-2 gap-4'>
                <div className='hidden'>
                  <FormField
                    control={form.control}
                    name="_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Id</FormLabel>
                        <FormControl>
                          <Input placeholder="Business ID" disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Query Mate" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your company name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="www.johndoe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="1234 Elm Street, Springfield, IL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter a detailed description about your business." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Please wait...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Page;
