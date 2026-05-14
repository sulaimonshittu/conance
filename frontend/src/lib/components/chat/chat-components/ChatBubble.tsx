import React from "react"
import type { ChatMessage } from "@/lib/api/chat.api"
import { Check, CheckCheck, Clock, AlertCircle, RotateCw } from "lucide-react"
import useChatStore from "@/lib/hooks/useChatStore"
import { useSearchParams } from "react-router-dom"

interface ChatBubbleProps {
    message: ChatMessage
    isSender: boolean
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender }) => {
    const { retryMessage } = useChatStore()
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get("jobId") || "proj1"

    // Format timestamp like "10:45 AM"
    const time = new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }).format(new Date(message.timestamp))

    const renderStatus = () => {
        if (!isSender) return null

        switch (message.status) {
            case 'sending':
                return <Clock size={12} className="animate-pulse" />
            case 'sent':
                return <Check size={14} />
            case 'delivered':
                return <CheckCheck size={14} />
            case 'read':
                return <CheckCheck size={14} className="text-[#A2E6D5]" />
            case 'failed':
                return (
                    <button 
                        onClick={() => retryMessage(jobId)}
                        className="flex items-center gap-1 text-red-300 hover:text-red-100 transition-colors"
                        title="Tap to retry"
                    >
                        <AlertCircle size={14} />
                        <RotateCw size={10} />
                    </button>
                )
            default:
                return null
        }
    }

    return (
        <div className={`flex w-full mb-s2 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                relative max-w-[85%] px-s3 py-2.5 rounded-2xl 
                ${isSender 
                    ? `bg-[#0D3D34] text-white rounded-tr-sm ${message.status === 'failed' ? 'ring-1 ring-red-400' : ''}` 
                    : 'bg-[#F4F4F5] text-gray-900 rounded-tl-sm border border-gray-200'
                }
                shadow-sm transition-all duration-300
                ${message.status === 'sending' ? 'opacity-80' : 'opacity-100'}
            `}>
                <p className="text-[15px] leading-relaxed font-medium">
                    {message.text}
                </p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isSender ? 'text-white/70' : 'text-gray-500'}`}>
                    <span className="text-[10px] font-medium">{time}</span>
                    <span className="ml-0.5 min-w-[14px] flex justify-center">
                        {renderStatus()}
                    </span>
                </div>
                
                {isSender && message.status === 'failed' && (
                    <div className="text-[9px] text-red-200 font-bold uppercase tracking-tighter mt-1 text-right animate-pulse">
                        Tap icons to retry
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatBubble
