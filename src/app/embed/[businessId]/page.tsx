'use client'
import AIChatBox from "@/components/AIChatBox";
import React from "react";

export default function Page({ params }: { params: { businessId: string } }) {
    const [chatboxOpen, setChatboxOpen] = React.useState(true)
    
    return (
        <div>
            My Post: {params.businessId}
            <AIChatBox businessId={params.businessId} open={chatboxOpen} onClose={() => setChatboxOpen(false)} />
        </div>
    )
}