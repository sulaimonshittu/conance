import { mockResponse } from "./apiUtils";
import { apiPost, apiGet } from "./apiClient";
import {
    MOCK_REQUESTS,
    MOCK_ACTIVE_PROJECTS,
    MOCK_FINISHED_PROJECTS,
    MOCK_TRANSACTIONS,
    DETAILED_MOCK_REQUESTS,
    MOCK_PENDING_PROPOSALS,
    MOCK_TOP_ARTISANS,
    type Artisan
} from "../utils/mockData";

export const artisanApi = {
    searchArtisans: async (query: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (!query) return mockResponse(MOCK_TOP_ARTISANS);

        const normalizedQuery = query.toLowerCase();
        const results = MOCK_TOP_ARTISANS.filter((artisan: Artisan) => {
            const matchesName = artisan.name.toLowerCase().includes(normalizedQuery);
            const matchesTitle = artisan.title.toLowerCase().includes(normalizedQuery);
            const matchesSkills = artisan.skills.some((skill) =>
                skill.toLowerCase().includes(normalizedQuery)
            );
            return matchesName || matchesTitle || matchesSkills;
        });
        return mockResponse(results);
    },

    getArtisanDetails: async (id: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const artisan = MOCK_TOP_ARTISANS.find((a: Artisan) => a.id === id);
        return mockResponse(artisan || null, !!artisan, artisan ? "Success" : "Artisan not found");
    },
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

    draftProposal: async (jobTitle: string, jobDescription: string, artisanBio: string) => {
        try {
            const params = new URLSearchParams({
                job_title: jobTitle,
                job_description: jobDescription,
                artisan_bio: artisanBio
            });
            const res = await apiGet<{ draft: string }>(`/proposals/draft?${params.toString()}`);
            if (res.success && res.data) {
                return { data: res.data.draft, success: true };
            }
            throw new Error("Fallback to mock");
        } catch {
            const proposal = `Good afternoon! I've reviewed your ${jobTitle.toLowerCase()} job request. I have extensive experience with similar jobs and completed 3 identical ones in your area last month. I'll bring all necessary materials including everything needed for a professional finish. I am available tomorrow morning and guarantee quality workmanship backed by my high Trust Score.`;
            return mockResponse(proposal);
        }
    },


    sendProposal: async (jobId: string | number, payload: { artisanId: string; priceKobo: number; etaMinutes: number; message: string }) => {
        try {
            // Using real api client
            // apiPost handles converting the payload keys from camelCase to snake_case automatically
            // e.g. priceKobo -> price_kobo
            const res = await apiPost(`/jobs/${jobId}/proposals`, payload);
            return res;
        } catch (error: any) {
            return mockResponse(null, false, error.message || "Failed to send proposal.");
        }
    },

    getPendingProposals: async () => {
        return mockResponse(MOCK_PENDING_PROPOSALS);
    },

    cancelProposal: async (id: string | number) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockResponse({ id }, true, "Proposal cancelled successfully");
    },

    getWalletSummary: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockResponse({
            escrow: 60000,
            released: 70000,
            balance: 0,
            accountDetails: {
                bankName: "Squad Virtual Account",
                accountNumber: "6711162182",
                accountName: "Conance Escrow - Squad"
            }
        });
    },

    fundWallet: async (amount: number) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return mockResponse({ amount }, true, "Funding request initiated. Please complete the transfer.");
    },

    /**
     * Get AI-recommended jobs for this artisan based on their profile.
     * GET /artisans/{id}/recommendations
     * Falls back to mock detailed requests on error so the UI never breaks.
     */
    fetchJobRecommendations: async (artisanId: string) => {
        try {
            const res = await apiGet<any[]>(`/artisans/${artisanId}/recommendations`);
            if (res.success && res.data && res.data.length > 0) {
                return res;
            }
            // Fallback: return mock requests shaped as DetailedRequests
            return mockResponse(DETAILED_MOCK_REQUESTS, true, "Recommendations loaded");
        } catch {
            return mockResponse(DETAILED_MOCK_REQUESTS, true, "Recommendations loaded (mock)");
        }
    },

    /**
     * Mark a job as in-progress (artisan started work).
     * POST /jobs/{id}/in-progress
     */
    markJobInProgress: async (jobId: string) => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/in-progress`, {});
            if (res.success) return { data: res.data, success: true, message: "Job marked as in-progress!" };
            return { data: null, success: false, message: res.message || "Failed to mark job as in-progress." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to mark job as in-progress." };
        }
    },
};

