import { create } from "zustand"
import { chatApi, type ChatMessage, type JobContext } from "../api/chat.api"
import useAuthStore from "./useAuthStore"
import { toast } from "sonner"

interface ChatState {
    messages: ChatMessage[]
    context: JobContext | null
    conversations: JobContext[]
    isLoading: boolean
    isListLoading: boolean
    isSending: boolean
    error: string | null

    fetchConversations: () => Promise<void>
    fetchChatData: (jobId: string) => Promise<void>
    sendMessage: (jobId: string, text: string) => Promise<boolean>
    startJob: (jobId: string) => Promise<boolean>
    sendMaterialPayment: (jobId: string, amount: number) => Promise<boolean>
    terminateJob: (jobId: string, reason: string) => Promise<boolean>
    rejectJob: (jobId: string, reason: string) => Promise<boolean>
    reopenChat: (jobId: string) => Promise<boolean>
    retryMessage: (jobId: string) => Promise<boolean>
    clearChat: () => void
}

const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    context: null,
    conversations: [],
    isLoading: true,
    isListLoading: true,
    isSending: false,
    error: null,

    clearChat: () => set({ messages: [], context: null, error: null, isLoading: true }),

    fetchConversations: async () => {
        set({ isListLoading: true, error: null });
        try {
            const res = await chatApi.getConversations();
            if (res.success && res.data) {
                set({ conversations: res.data, isListLoading: false });
            } else {
                set({ error: res.message || "Failed to load conversations", isListLoading: false });
            }
        } catch (error) {
            set({ error: "An unexpected error occurred", isListLoading: false });
        }
    },

    fetchChatData: async (jobId: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await chatApi.getChatContext(jobId);
            if (res.success && res.data) {
                set({ 
                    context: res.data.context, 
                    messages: res.data.messages, 
                    isLoading: false 
                });
            } else {
                set({ error: res.message || "Failed to load chat", isLoading: false });
            }
        } catch (error) {
            set({ error: "An unexpected error occurred", isLoading: false });
        }
    },

    sendMessage: async (jobId: string, text: string) => {
        const { user } = useAuthStore.getState()
        if (!user) {
            toast.error("You must be logged in to send messages")
            return false
        }

        const tempId = `temp_${Date.now()}`
        const optimisticMessage: ChatMessage = {
            id: tempId,
            senderId: user.id,
            text,
            timestamp: new Date(),
            status: 'sending'
        }

        // 1. Optimistic Update
        set(state => ({
            messages: [...state.messages, optimisticMessage]
        }))

        // 2. API Call
        const res = await chatApi.sendMessage(jobId, text, user.id)
        
        if (res.success && res.data) {
            // 3. Success Update
            set(state => ({
                messages: state.messages.map(m => 
                    m.id === tempId ? { ...res.data!, id: res.data!.id } : m
                )
            }))
            return true
        } else {
            // 4. Failure Update
            set(state => ({
                messages: state.messages.map(m => 
                    m.id === tempId ? { ...m, status: 'failed' } : m
                )
            }))
            return false
        }
    },

    retryMessage: async (jobId: string) => {
        const { messages } = get()
        const { user } = useAuthStore.getState()
        const failedMsg = [...messages].reverse().find(m => m.status === 'failed' && m.senderId === user?.id)
        
        if (!failedMsg || !user) return false

        // 1. Reset status to sending
        set(state => ({
            messages: state.messages.map(m => 
                m.id === failedMsg.id ? { ...m, status: 'sending' } : m
            )
        }))

        // 2. Retry API call
        const res = await chatApi.sendMessage(jobId, failedMsg.text, user.id)
        
        if (res.success && res.data) {
            set(state => ({
                messages: state.messages.map(m => 
                    m.id === failedMsg.id ? { ...res.data!, id: res.data!.id } : m
                )
            }))
            return true
        } else {
            set(state => ({
                messages: state.messages.map(m => 
                    m.id === failedMsg.id ? { ...m, status: 'failed' } : m
                )
            }))
            return false
        }
    },

    startJob: async (jobId: string) => {
        const res = await chatApi.startJob(jobId)
        if (res.success && res.data) {
            set(state => ({
                context: state.context ? { ...state.context, status: res.data!.status as JobContext['status'] } : null
            }))
            toast.success("Job started successfully")
            return true
        }
        toast.error(res.message || "Failed to start job")
        return false
    },

    sendMaterialPayment: async (jobId: string, amount: number) => {
        const res = await chatApi.sendMaterialPayment(jobId, amount)
        if (res.success) {
            toast.success(res.message)
            return true
        }
        toast.error(res.message || "Failed to send payment")
        return false
    },

    terminateJob: async (jobId: string, reason: string) => {
        const res = await chatApi.terminateJob(jobId, reason)
        if (res.success && res.data) {
            set(state => ({
                context: state.context ? { ...state.context, status: res.data!.status as JobContext['status'] } : null
            }))
            toast.success("Job terminated")
            return true
        }
        toast.error(res.message || "Failed to terminate job")
        return false
    },

    rejectJob: async (jobId: string, reason: string) => {
        const res = await chatApi.rejectJob(jobId, reason)
        if (res.success && res.data) {
            set(state => ({
                context: state.context ? { ...state.context, status: res.data!.status as JobContext['status'] } : null
            }))
            toast.success("Job rejected")
            return true
        }
        toast.error(res.message || "Failed to reject job")
        return false
    },

    reopenChat: async (jobId: string) => {
        const res = await chatApi.reopenChat(jobId)
        if (res.success && res.data) {
            set(state => ({
                context: state.context ? { ...state.context, status: res.data!.status as JobContext['status'] } : null
            }))
            toast.success("Conversation reopened successfully")
            return true
        }
        toast.error(res.message || "Failed to reopen conversation")
        return false
    }
}))

export default useChatStore
