import { MessageSquarePlus } from "lucide-react"

const ChatEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-s4 text-center h-[70vh]">
            <div className="w-20 h-20 bg-[#E9F2F0] rounded-full flex items-center justify-center mb-s4 shadow-inner">
                <MessageSquarePlus size={36} className="text-[#0D3D34]" />
            </div>
            <h2 className="text-h3 font-bold text-gray-900 mb-2">Welcome to Conance</h2>
            <p className="text-b2 text-text-muted max-w-[280px] leading-relaxed">
                Your conversations with artisans and clients will appear here once a job is accepted or started.
            </p>
        </div>
    )
}

export default ChatEmptyState
