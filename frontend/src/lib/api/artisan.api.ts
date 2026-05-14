import { mockResponse } from "./apiUtils";
import { 
    MOCK_REQUESTS, 
    MOCK_ACTIVE_PROJECTS, 
    MOCK_FINISHED_PROJECTS, 
    MOCK_TRANSACTIONS,
    DETAILED_MOCK_REQUESTS,
    MOCK_PENDING_PROPOSALS
} from "../utils/mockData";

export const artisanApi = {
    getRequests: async () => {
        return mockResponse(MOCK_REQUESTS);
    },

    getDetailedRequests: async () => {
        return mockResponse(DETAILED_MOCK_REQUESTS);
    },

    getActiveProjects: async () => {
        return mockResponse(MOCK_ACTIVE_PROJECTS);
    },

    getFinishedProjects: async () => {
        return mockResponse(MOCK_FINISHED_PROJECTS);
    },

    getEarningsTransactions: async () => {
        return mockResponse(MOCK_TRANSACTIONS);
    },

    getProjectById: async (id: string | number) => {
        const project = MOCK_ACTIVE_PROJECTS.find(p => p.id === id) || 
                        MOCK_FINISHED_PROJECTS.find(p => p.id === id) ||
                        DETAILED_MOCK_REQUESTS.find(r => r.id === id);
        return mockResponse(project || null, !!project, "Item not found");
    },

    generateProposal: async (id: string | number) => {
        const request = DETAILED_MOCK_REQUESTS.find(r => r.id === id);
        const title = request?.title || "this job";
        const proposal = `Good afternoon! I've reviewed your ${title.toLowerCase()} job request. I have extensive experience with similar installations and completed 3 identical jobs in your area last month. I'll bring all necessary materials including everything needed for a professional finish. The job will take approximately 3-4 hours to complete professionally. I'm available tomorrow morning and guarantee quality workmanship backed by my high Trust Score.`;
        return mockResponse(proposal);
    },

    sendProposal: async (id: string | number, proposal: string) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simulate a 10% failure rate
        const isSuccess = Math.random() > 0.1;
        if (isSuccess) {
            return mockResponse({ id, proposal }, true, "Proposal sent successfully!");
        } else {
            return mockResponse(null, false, "Failed to send proposal. Please try again.");
        }
    },

    getPendingProposals: async () => {
        return mockResponse(MOCK_PENDING_PROPOSALS);
    },

    cancelProposal: async (id: string | number) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockResponse({ id }, true, "Proposal cancelled successfully");
    }
};
