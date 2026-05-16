import { mockResponse, delay } from "./apiUtils";
import { apiGet, apiPost } from "./apiClient";

export interface ChatMessage {
    id: string;
    senderId: string; // 'artisan' or 'client' for our mock
    body: string;
    text?: string; // deprecated alias, use body
    redactedBody?: string | null;
    createdAt?: string;
    timestamp: Date; // Keep for local state ordering
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface JobContext {
    id: string;
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'terminated' | 'rejected' | 'reopened' | 'archived';
    partnerName: string;
    partnerAvatar: string;
    jobTitle: string;
    totalAmount: number;
}

// Mock Data for context (since /jobs/{id} is not yet available)
const MOCK_JOB_CONTEXT: Record<string, JobContext> = {
    "proj1": {
        id: "proj1",
        status: "in-progress",
        partnerName: "Blessing Enang",
        partnerAvatar: "https://i.pravatar.cc/150?img=20",
        jobTitle: "Modern Wardrobe Construction",
        totalAmount: 150000
    }
};

export const chatApi = {
    /** Fetch list of conversations */
    getConversations: async () => {
        await delay(1000);
        return mockResponse(Object.values(MOCK_JOB_CONTEXT), true, "Conversations loaded");
    },

    /** Fetch conversation history and job context */
    getChatContext: async (jobId: string) => {
        // Fetch real messages from backend
        let messages: ChatMessage[] = [];
        try {
            const res = await apiGet<any[]>(`/jobs/${jobId}/messages`);
            if (res.success && res.data) {
                messages = res.data.map(m => ({
                    id: m.id,
                    senderId: m.senderId,
                    body: m.body,
                    text: m.body, // fallback
                    redactedBody: m.redactedBody,
                    createdAt: m.createdAt,
                    timestamp: new Date(m.createdAt),
                    status: 'read'
                }));
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }

        const context = MOCK_JOB_CONTEXT[jobId] || {
            id: jobId,
            status: "accepted", // Default to accepted for testing
            partnerName: "Test Partner",
            partnerAvatar: "https://i.pravatar.cc/150?img=1",
            jobTitle: "Test Job",
            totalAmount: 50000
        };
        
        return mockResponse({ context, messages }, true, "Chat loaded");
    },

    /** Send a new message */
    sendMessage: async (jobId: string, body: string, senderId: string) => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/messages`, { body, senderId });
            if (res.success && res.data) {
                const m = res.data;
                const newMessage: ChatMessage = {
                    id: m.id,
                    senderId: m.senderId,
                    body: m.body,
                    text: m.body,
                    redactedBody: m.redactedBody,
                    createdAt: m.createdAt,
                    timestamp: new Date(m.createdAt || Date.now()),
                    status: 'sent'
                };
                return mockResponse(newMessage, true, "Message sent");
            }
            return mockResponse(null, false, res.message || "Failed to send message");
        } catch (error: any) {
            return mockResponse(null, false, error.message || "Failed to send message");
        }
    },

    /** Role actions */
    startJob: async (jobId: string) => {
        await delay(1500);
        if (MOCK_JOB_CONTEXT[jobId]) MOCK_JOB_CONTEXT[jobId].status = 'in-progress';
        return mockResponse({ jobId, status: 'in-progress' }, true, "Job started successfully");
    },

    sendMaterialPayment: async (_jobId: string, amount: number) => {
        await delay(2000);
        return mockResponse(null, true, `Payment of ₦${amount.toLocaleString()} sent successfully`);
    },

    terminateJob: async (jobId: string, _reason: string) => {
        await delay(1500);
        if (MOCK_JOB_CONTEXT[jobId]) MOCK_JOB_CONTEXT[jobId].status = 'terminated';
        return mockResponse({ jobId, status: 'terminated' }, true, "Job terminated");
    },

    rejectJob: async (jobId: string, _reason: string) => {
        await delay(1000);
        if (MOCK_JOB_CONTEXT[jobId]) MOCK_JOB_CONTEXT[jobId].status = 'rejected';
        return mockResponse({ jobId, status: 'rejected' }, true, "Job rejected");
    },

    reopenChat: async (jobId: string) => {
        await delay(1000);
        if (MOCK_JOB_CONTEXT[jobId]) MOCK_JOB_CONTEXT[jobId].status = 'reopened';
        return mockResponse({ jobId, status: 'reopened' }, true, "Conversation reopened");
    }
};
