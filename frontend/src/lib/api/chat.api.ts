import { mockResponse, delay } from "./apiUtils";

export interface ChatMessage {
    id: string;
    senderId: string; // 'artisan' or 'client' for our mock
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

export interface JobContext {
    id: string;
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'terminated' | 'rejected' | 'reopened' | 'archived';
    partnerName: string;
    partnerAvatar: string;
    jobTitle: string;
    totalAmount: number;
}

// Mock Data
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    "proj1": [
        { id: "msg1", senderId: "client", text: "Hello, I wanted to check on the progress of the wardrobe.", timestamp: new Date(Date.now() - 3600000 * 2), status: "read" },
        { id: "msg2", senderId: "artisan", text: "Hi! I'm currently working on the main frame. Should be done by tomorrow.", timestamp: new Date(Date.now() - 3600000 * 1), status: "read" },
        { id: "msg3", senderId: "client", text: "Great, let me know when you need the next material payment.", timestamp: new Date(Date.now() - 1800000), status: "read" },
    ]
};

const MOCK_JOB_CONTEXT: Record<string, JobContext> = {
    "proj1": {
        id: "proj1",
        status: "in-progress",
        partnerName: "Blessing Enang",
        partnerAvatar: "https://i.pravatar.cc/150?img=20",
        jobTitle: "Modern Wardrobe Construction",
        totalAmount: 150000
    },
    "proj2": {
        id: "proj2",
        status: "completed",
        partnerName: "Samuel Johnson",
        partnerAvatar: "https://i.pravatar.cc/150?img=11",
        jobTitle: "Door Lock Installation",
        totalAmount: 8000
    },
    "proj3": {
        id: "proj3",
        status: "pending",
        partnerName: "Grace Aminu",
        partnerAvatar: "https://i.pravatar.cc/150?img=41",
        jobTitle: "Kitchen Sink Fix",
        totalAmount: 12000
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
        await delay(1000);
        const context = MOCK_JOB_CONTEXT[jobId] || {
            id: jobId,
            status: "accepted", // Default to accepted for testing
            partnerName: "Test Partner",
            partnerAvatar: "https://i.pravatar.cc/150?img=1",
            jobTitle: "Test Job",
            totalAmount: 50000
        };
        const messages = MOCK_MESSAGES[jobId] || [];
        return mockResponse({ context, messages }, true, "Chat loaded");
    },

    /** Send a new message */
    sendMessage: async (jobId: string, text: string, senderId: string) => {
        await delay(800); // Simulate network latency
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            senderId,
            text,
            timestamp: new Date(),
            status: 'sent'
        };
        
        // In a real app, this would append to the DB and possibly emit a webhook
        if (!MOCK_MESSAGES[jobId]) MOCK_MESSAGES[jobId] = [];
        MOCK_MESSAGES[jobId].push(newMessage);
        
        return mockResponse(newMessage, true, "Message sent");
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
