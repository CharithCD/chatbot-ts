"use client"
import React, { useEffect } from 'react'
import { Message, useChat } from 'ai/react'
import { Bot, SendHorizonal, Trash, XCircle } from "lucide-react";
import ReactMarkDown from "react-markdown";
import Link from 'next/link'
import { Card, CardContent } from './ui/card';

interface AIChatBoxProps {
    open: boolean,
    onClose: () => void
}

interface ChatMessageProps {
    message: Message
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
    const isAIMessage = role === 'assistant';

    return (
        <div className={`p-2 mb-3 flex items-center ${isAIMessage ? 'me-5 justify-start' : 'ms-5 justify-end'} `}>
            {isAIMessage && <Bot className='mr-2 flex-none w-5' size={24}/>}
            <div className={`rounded-md border px-3 py-2 ${isAIMessage ? 'bg-background' : 'bg-foreground text-background'}`}>
                <ReactMarkDown components={{
                    a: ({ node, ref, ...props }) => (
                        <Link
                            {...props}
                            href={props.href ?? ""}
                            className='text-primary hover:underline' />
                    ),
                    p: ({ node, ...props }) => (
                        <p {...props} className="mt-3 first:mt-0 text-sm" />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc list-inside" />
                    ),
                    li: ({ node, ...props }) => (
                        <li {...props} className="mt-1 first:mt-0" />
                    )
                }}>
                    {content}
                </ReactMarkDown>
            </div>
        </div>
    );
}

const AIChatBox = ({ open, onClose }: AIChatBoxProps) => {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error
    } = useChat({
        //                 initialMessages: [{
        //                     id: '1',
        //                     role: 'assistant',
        //                     content: 'Hello, Welcome to my AI Chatbot. How can I help you?'
        //                 },
        //                 {
        //                     id: '2',
        //                     role: 'user',
        //                     content: 'Hi, how are you?'
        //                 },
        //                 {
        //                     id: '3',
        //                     role: 'assistant',
        //                     content: `[Google](https://google.com)
        // List:
        // - item 1
        // - item 2`
        //                 }
        //                 ]
    });

    const lastMessageIsUser = messages.length > 0 && messages[messages.length - 1].role === 'user';
    const inputRef = React.useRef<HTMLInputElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => { 
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    return (
        <div className={`${open ? "fixed" : "hidden"} bottom-0 right-0 z-50 w-full max-w-[400px] p-1 xl:right-36`}>
            <div className='text-right pr-2'>
                <button>
                    <XCircle size={28} onClick={onClose} />
                </button>
            </div>
            <Card className='h-full bg-black'>
                <CardContent className='h-[420px] overflow-y-auto p-2' ref={scrollRef}>
                    {
                        messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))
                    }
                    {
                        isLoading && lastMessageIsUser && (
                            <ChatMessage
                                message={{
                                    id: '1',
                                    role: 'assistant',
                                    content: 'Loading...'
                                }}
                            />
                        )
                    }
                    {
                        error && (
                            <ChatMessage
                                message={{
                                    id: 'error',
                                    role: 'assistant',
                                    content: 'Something went wrong. Please try again.'
                                }}
                            />
                        )
                    }
                    {
                        !error && messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Bot size={30} className="animate-bounce" />
                                <div className="ml-2">
                                    <p className="font-medium text-foreground">
                                        Send a message to start the conversation.
                                    </p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-sm mt-12 mx-8'>
                                        You can ask the Chatbot any thing abot me it will find
                                        the relavant answer.
                                    </p>
                                </div>

                            </div>
                        )
                    }
                </CardContent>
                <form onSubmit={handleSubmit} className='m-3 flex gap-1'>
                    <button type='button'
                        className='flex items-center justify-center w-10 flex-none'
                        title='Clear Messages'
                        onClick={() => setMessages([])}>
                        <Trash size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 py-2 rounded-lg border-0 text-sm bg-transparent shadow-none focus-visible:ring-0"
                        placeholder="Type your message here..."
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        ref={inputRef}
                    />
                    <button
                        type='submit'
                        className='flex items-center justify-center w-10 flex-none disabled:opacity-50'
                        disabled={isLoading || input.trim().length === 0}
                        title='Submit Message'
                    >
                        <SendHorizonal size={20} />
                    </button>
                </form>
                {/* <ChatInput /> */}
            </Card>
        </div>

    )
}

export default AIChatBox