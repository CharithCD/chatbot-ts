import AIChatButton from "@/components/AIChatButton";
import { Button } from "@/components/ui/button";
import Navbar from "@/sections/Navbar";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div>
        <div className="relative max-w-screen-xl px-12 mx-auto p-4 flex justify-center">
          <div className="mt-8 flex flex-col items-center text-center md:mt-16">

            <h1 className="text-3xl font-semibold lg:leading-snug md:text-4xl lg:text-5xl">
              Transform Your Customer Service with
            </h1>
            <h1 className="text-3xl font-semibold lg:leading-snug md:text-4xl lg:-mt-3 lg:text-5xl">
              AI-Powered <span className='text-primary'>Chatbots</span>
            </h1>

            <p className="mt-6 mb-16 max-w-lg text-center leading-6 text-gray-400 lg:text-[16px]">
              Effortlessly integrate intelligent chatbots into your website to provide instant, accurate, and personalized responses to your customers.
            </p>

            <Button asChild className='py-5 md:py-6 md:px-10 md:text-lg z-10'>
              <Link href={'/signup'}>Get Started <ArrowRight className="text-lg ml-4 h-6 w-6" /> </Link>
            </Button>
          </div>
        </div>
        <main className="flex flex-col items-center">
          <Image src='/exlipse.png' width={900} height={900} className="absolute top-0 z-0" alt="background blur" />
        </main>
        <div className="absolute flex justify-center items-center align-middle bg-background border-2 border-primary w-12 h-12 rounded-full bottom-5 right-16">
          <AIChatButton/>
        </div>

      </div>
    </>
  );
}
