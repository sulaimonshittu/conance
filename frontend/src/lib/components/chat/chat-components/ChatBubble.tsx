import React from "react"
import type { ChatMessage } from "@/lib/api/chat.api"
import { Check, CheckCheck } from "lucide-react"

interface ChatBubbleProps {
    message: ChatMessage
    isSender: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender }) => {
    
    // Format timestamp like "10:45 AM"
    const time = new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }).format(new Date(message.timestamp))

    return (
        <div className={`flex w-full mb-s2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                relative max-w-[85%] px-s3 py-2.5 rounded-2xl 
                ${isSender 
                    ? 'bg-[#0D3D34] text-white rounded-tr-sm' 
                    : 'bg-[#F4F4F5] text-gray-900 rounded-tl-sm border border-gray-200'
                }
                shadow-sm
            `}>
                <p className="text-[15px] leading-relaxed font-medium">
                    {message.text}
                </p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isSender ? 'text-white/70' : 'text-gray-500'}`}>
                    <span className="text-[10px] font-medium">{time}</span>
                    {isSender && (
                        <span className="ml-0.5">
                            {message.status === 'read' ? (
                                <CheckCheck size={14} className="text-[#A2E6D5]" />
                            ) : message.status === 'delivered' ? (
                                <CheckCheck size={14} />
                            ) : (
                                <Check size={14} />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatBubble
