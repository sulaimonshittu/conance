import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import useChatStore from "@/lib/hooks/useChatStore"
import useAuthStore from "@/lib/hooks/useAuthStore"
import ChatHeader from "./chat-components/ChatHeader"
import ChatMessages from "./chat-components/ChatMessages"
import ChatInput from "./chat-components/ChatInput"
import ChatDisclaimer from "./chat-components/ChatDisclaimer"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

const Chat = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const jobId = searchParams.get("jobId") || "proj1" // Fallback to mock ID for testing
    
    const { fetchChatData, isLoading, error, context, clearChat } = useChatStore()
    const { role } = useAuthStore()

    useEffect(() => {
        fetchChatData(jobId)
        return () => clearChat()
    }, [jobId, fetchChatData, clearChat])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Connecting to secure chat...</p>
            </div>
        )
    }

    if (error || !context) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-s4 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-s3">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-h3 font-bold text-gray-900 mb-2">Failed to load chat</h2>
                <p className="text-b2 text-text-muted mb-s4 max-w-sm">
                    {error || "Could not retrieve the conversation history. Please try again."}
                </p>
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-s4 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={18} /> Go Back
                </button>
            </div>
        )
    }

    // Role-based Access Rules
    // Artisans cannot chat with clients if the job is just 'pending'
    if (role === "artisan" && context.status === "pending") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-s4 text-center">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-s3">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-h3 font-bold text-gray-900 mb-2">Chat Unavailable</h2>
                <p className="text-b2 text-text-muted mb-s4 max-w-sm">
                    You can only communicate with the client after the proposal has been accepted.
                </p>
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-s4 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={18} /> Return to Job Details
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen max-w-[500px] mx-auto bg-white relative overflow-hidden">
            <ChatHeader />
            <ChatDisclaimer />
            <ChatMessages />
            <ChatInput jobId={jobId} />
        </div>
    )
}

export default Chat