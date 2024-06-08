"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { faqSchema } from '@/types/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [faqData, setFaqData] = useState([]);

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

  useEffect(() => {
    if (hasFetched) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/faq`);
        const data = response.data.data;
        setFaqData(data);
        setHasFetched(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching FAQ's",
          description: "Could not fetch FAQs'. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasFetched]);

  const form = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });


  async function onSubmit(values: z.infer<typeof faqSchema>) {
    try {
      const response = await axios.post("/api/faq", values);
      if (response.status >= 200 && response.status < 300) {
        router.push("/dashboard/faq");
        form.reset();
        showSuccessToast("FAQ submitted successfully!");
      } else {
        showErrorToast("Failed. Please try again.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        const errorMessage = data?.error || "An error occurred during adding FAQ";
        showErrorToast(errorMessage);
      } else if (error instanceof z.ZodError) {
        error.errors.forEach(errorItem => {
          const field = errorItem.path.join('.');
          form.setError(field as keyof z.infer<typeof faqSchema>, {
            type: "server",
            message: errorItem.message,
          });
        });
      } else {
        showErrorToast("An unexpected error occurred during adding FAQ");
      }
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">FAQ</h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className='p-8 w-full'>
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='lg:w-1/2 border-2 p-8  rounded-[0.55rem]'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className='flex flex-col gap-4'>
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="What are your opening hours?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Our opening hours are Monday to Friday from 9:00 AM to 6:00 PM,
                            and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Please wait...
                      </>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            <div className='lg"w-1/2 border-2 p-8  rounded-[0.55rem]'>
              {
                loading ? <Loader2 className="animate-spin mr-2" /> :
                  <div>
                    {
                      faqData.map((faq, index) => {
                        return (
                          <Card key={index}>
                            <CardTitle>{faq.question}</CardTitle>
                            <CardContent>{faq.answer}</CardContent>
                          </Card>
                        )
                      })
                    }
                  </div>
              }
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default page