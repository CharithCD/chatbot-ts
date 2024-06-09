"use client"
import { Bot } from 'lucide-react'
import React from 'react'
import AIChatBox from './AIChatBox'
import { Button } from './ui/button'

const AIChatButton = () => {
    const [chatboxOpen, setChatboxOpen] = React.useState(false)

    return (
        <div className='bg-black'>
            <button onClick={() => setChatboxOpen(true)}>
                <Bot  />
                <span className="sr-only">Open Chat theme</span>
            </button>
            <AIChatBox open={chatboxOpen} onClose={() => setChatboxOpen(false)} />
        </div>
    )
}

export default AIChatButton