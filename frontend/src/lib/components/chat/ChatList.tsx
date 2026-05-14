import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import useChatStore from "@/lib/hooks/useChatStore"
import useAuthStore from "@/lib/hooks/useAuthStore"
import ChatSearch from "./chat-components/ChatSearch"
import ChatEmptyState from "./chat-components/ChatEmptyState"
import ChatConversationItem from "./chat-components/ChatConversationItem"
import Chat from "./Chat"

const ChatList = () => {
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get("jobId")
    const { conversations, fetchConversations, isListLoading } = useChatStore()
    const { role } = useAuthStore()
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchConversations()
    }, [fetchConversations])

    const filteredConversations = useMemo(() => {
        let filtered = conversations
        
        // Role-based visibility rules: Artisans shouldn't see 'pending' chats in their active list
        if (role === "artisan") {
            filtered = filtered.filter(c => c.status !== "pending")
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(c => 
                c.partnerName.toLowerCase().includes(query) || 
                c.jobTitle.toLowerCase().includes(query)
            )
        }
        
        return filtered
    }, [conversations, searchQuery, role])

    if (jobId) {
        return <Chat />
    }

    if (isListLoading && conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-text-muted font-medium text-sm">Loading conversations...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-s3 py-s3 border-b border-accent/30 bg-white">
                <h1 className="text-h2 font-bold text-gray-900">Messages</h1>
            </div>
            
            <ChatSearch value={searchQuery} onChange={setSearchQuery} />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredConversations.length === 0 ? (
                    <ChatEmptyState />
                ) : (
                    <div className="flex flex-col">
                        {filteredConversations.map(conv => (
                            <ChatConversationItem key={conv.id} conversation={conv} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatList
