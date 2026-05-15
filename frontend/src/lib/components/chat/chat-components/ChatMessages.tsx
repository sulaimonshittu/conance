import { useEffect, useRef } from "react"
import useChatStore from "@/lib/hooks/useChatStore"
import useAuthStore from "@/lib/hooks/useAuthStore"
import ChatBubble from "./ChatBubble"

const ChatMessages = () => {
    const { messages, isSending } = useChatStore()
    const { role } = useAuthStore()
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Auto-scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isSending])

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-s4 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-s2">
                    <span className="text-2xl">👋</span>
                </div>
                <h3 className="text-b1 font-bold text-gray-900 mb-1">Say Hello!</h3>
                <p className="text-b3 text-text-muted max-w-[200px]">
                    Start the conversation. Be sure to discuss all job details before proceeding.
                </p>
            </div>
        )
    }

    return (
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-s3 py-s4 custom-scrollbar flex flex-col"
        >
            {messages.map((msg) => (
                <ChatBubble 
                    key={msg.id} 
                    message={msg} 
                    isSender={msg.senderId === role} 
                />
            ))}
        </div>
    )
}

export default ChatMessages
