import { create } from "zustand"
import { artisanApi } from "../api/artisan.api"
import type {
    ActiveProject,
    FinishedProject,
    DetailedRequest,
    Transaction,
    PendingProposal
} from "../utils/mockData"

interface ArtisanState {
    activeProjects: ActiveProject[]
    finishedProjects: FinishedProject[]
    requests: DetailedRequest[]
    transactions: Transaction[]
    pendingProposals: PendingProposal[]
    isLoading: boolean
    error: string | null

    fetchDashboardData: () => Promise<void>
    fetchProjects: () => Promise<void>
    fetchRequests: () => Promise<void>
    fetchEarnings: () => Promise<void>
    fetchPendingProposals: () => Promise<void>
    cancelProposal: (id: string | number) => Promise<boolean>
    clearError: () => void
}

const useArtisanStore = create<ArtisanState>((set, get) => ({
    activeProjects: [],
    finishedProjects: [],
    requests: [],
    transactions: [],
    pendingProposals: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [projectsRes, requestsRes] = await Promise.all([
                artisanApi.getActiveProjects(),
                artisanApi.getDetailedRequests()
            ]);

            if (projectsRes.success && requestsRes.success) {
                set({
                    activeProjects: projectsRes.data || [],
                    requests: requestsRes.data || [],
                    isLoading: false
                });
            } else {
                set({ error: "Failed to load dashboard data", isLoading: false });
            }
        } catch (err) {
            set({ error: "An unexpected error occurred", isLoading: false });
        }
    },

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        const [activeRes, finishedRes] = await Promise.all([
            artisanApi.getActiveProjects(),
            artisanApi.getFinishedProjects()
        ]);

        if (activeRes.success && finishedRes.success) {
            set({
                activeProjects: activeRes.data || [],
                finishedProjects: finishedRes.data || [],
                isLoading: false
            });
        } else {
            set({ error: "Failed to load projects", isLoading: false });
        }
    },

    fetchRequests: async () => {
        set({ isLoading: true, error: null });
        const res = await artisanApi.getDetailedRequests();
        if (res.success) {
            set({ requests: res.data || [], isLoading: false });
        } else {
            set({ error: res.message || "Failed to load requests", isLoading: false });
        }
    },

    fetchEarnings: async () => {
        set({ isLoading: true, error: null });
        const res = await artisanApi.getEarningsTransactions();
        if (res.success) {
            set({ transactions: res.data || [], isLoading: false });
        } else {
            set({ error: res.message || "Failed to load earnings", isLoading: false });
        }
    },

    fetchPendingProposals: async () => {
        set({ isLoading: true, error: null });
        const res = await artisanApi.getPendingProposals();
        if (res.success) {
            set({ pendingProposals: res.data || [], isLoading: false });
        } else {
            set({ error: res.message || "Failed to load proposals", isLoading: false });
        }
    },

    cancelProposal: async (id) => {
        set({ isLoading: true, error: null });
        const res = await artisanApi.cancelProposal(id);
        if (res.success) {
            const updatedProposals = get().pendingProposals.filter(p => p.id !== id);
            set({ pendingProposals: updatedProposals, isLoading: false });
            return true;
        } else {
            set({ error: res.message || "Failed to cancel proposal", isLoading: false });
            return false;
        }
    }
}))

export default useArtisanStore
