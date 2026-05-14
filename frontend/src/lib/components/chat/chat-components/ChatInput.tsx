import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import useChatStore from "@/lib/hooks/useChatStore"

interface ChatInputProps {
    jobId: string
}

const ChatInput = ({ jobId }: ChatInputProps) => {
    const [text, setText] = useState("")
    const { sendMessage, isSending, context } = useChatStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const isInputDisabled = !context || 
                            context.status === "terminated" || 
                            context.status === "rejected" || 
                            context.status === "completed" || 
                            context.status === "archived" || 
                            isSending

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [text])

    const handleSend = async () => {
        if (!text.trim() || isInputDisabled) return
        
        const messageToSend = text.trim()
        setText("") // Clear immediately for optimistic feel
        
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        await sendMessage(jobId, messageToSend)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-s3 bg-white border-t border-accent/40 z-10">
            {context?.status === "terminated" ? (
                <div className="bg-red-50 text-red-600 text-center py-3 rounded-2xl font-medium text-sm border border-red-100">
                    This job has been terminated. Chat is closed.
                </div>
            ) : context?.status === "rejected" ? (
                <div className="bg-red-50 text-red-600 text-center py-3 rounded-2xl font-medium text-sm border border-red-100">
                    This job was rejected. Chat is closed.
                </div>
            ) : context?.status === "completed" || context?.status === "archived" ? (
                <div className="bg-gray-50 text-gray-600 text-center py-3 px-4 rounded-2xl font-medium text-[13px] border border-gray-200 leading-relaxed">
                    This job has been completed. Messaging has been disabled unless the client reopens the conversation.
                </div>
            ) : (
                <div className="flex items-end gap-s2 bg-[#FAF7F2] p-2 rounded-[24px] border border-accent/50 focus-within:border-primary/40 focus-within:bg-white transition-colors">
                    <button 
                        className="p-2.5 text-text-muted hover:text-primary transition-colors disabled:opacity-50"
                        disabled={isInputDisabled}
                    >
                        <Paperclip size={20} />
                    </button>
                    
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={isInputDisabled}
                        className="flex-1 max-h-[120px] py-3 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[15px] custom-scrollbar placeholder:text-gray-400 disabled:opacity-50"
                        rows={1}
                    />
                    
                    <button 
                        onClick={handleSend}
                        disabled={!text.trim() || isInputDisabled}
                        className="p-3 bg-[#0D3D34] text-white rounded-full hover:bg-[#092D26] transition-colors disabled:opacity-50 disabled:bg-gray-300 active:scale-95 flex items-center justify-center shrink-0 shadow-sm"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ChatInput
