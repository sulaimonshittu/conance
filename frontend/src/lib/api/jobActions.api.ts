import { apiPost, apiGet } from "./apiClient";
import type { ApiResponse } from "./apiUtils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BackendProposal {
    id: string;
    jobId: string;
    artisanId: string;
    artisanName?: string;
    artisanAvatar?: string;
    artisanTitle?: string;
    priceKobo: number;
    etaMinutes: number;
    message: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    rating?: number;
    reviewCount?: number;
}

// ─────────────────────────────────────────────
// Job Actions API
// ─────────────────────────────────────────────

export const jobActionsApi = {
    /**
     * Assign an artisan to a job after accepting their proposal.
     * POST /jobs/{id}/assign — body: { artisan_id }
     */
    assignJob: async (jobId: string, artisanId: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/assign`, { artisanId });
            if (res.success) return { data: res.data, success: true, message: "Artisan hired successfully!" };
            return { data: null, success: false, message: res.message || "Failed to hire artisan." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to hire artisan." };
        }
    },

    /**
     * List all proposals submitted for a job.
     * GET /jobs/{id}/proposals
     */
    listProposals: async (jobId: string): Promise<ApiResponse<BackendProposal[]>> => {
        try {
            const res = await apiGet<BackendProposal[]>(`/jobs/${jobId}/proposals`);
            if (res.success && res.data) return { data: res.data, success: true };
            return { data: [], success: true, message: res.message };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to load proposals." };
        }
    },

    /**
     * Accept a specific proposal.
     * POST /proposals/{id}/accept — body: { client_id }
     */
    acceptProposal: async (proposalId: string, clientId: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/proposals/${proposalId}/accept`, { clientId });
            if (res.success) return { data: res.data, success: true, message: "Proposal accepted!" };
            return { data: null, success: false, message: res.message || "Failed to accept proposal." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to accept proposal." };
        }
    },

    /**
     * Mark a job as in progress (artisan has started work).
     * POST /jobs/{id}/in-progress
     */
    markInProgress: async (jobId: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/in-progress`, {});
            if (res.success) return { data: res.data, success: true, message: "Job marked as in-progress!" };
            return { data: null, success: false, message: res.message || "Failed to update job status." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to update job status." };
        }
    },

    /**
     * Submit completed work with photos (artisan side).
     * POST /jobs/{id}/submit — body: { artisan_id, photos, note }
     */
    submitWork: async (jobId: string, artisanId: string, photos: string[], note: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/submit`, { artisanId, photos, note });
            if (res.success) return { data: res.data, success: true, message: "Work submitted successfully!" };
            return { data: null, success: false, message: res.message || "Failed to submit work." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to submit work." };
        }
    },

    /**
     * Release escrow funds to the artisan (client side).
     * POST /jobs/{id}/release — body: { client_id }
     */
    releaseFunds: async (jobId: string, clientId: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/release`, { clientId });
            if (res.success) return { data: res.data, success: true, message: "Funds released successfully!" };
            return { data: null, success: false, message: res.message || "Failed to release funds." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to release funds." };
        }
    },

    /**
     * Open a dispute for a job.
     * POST /jobs/{id}/disputes — body: { opener_id, reason }
     */
    openDispute: async (jobId: string, openerId: string, reason: string): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/jobs/${jobId}/disputes`, { openerId, reason });
            if (res.success) return { data: res.data, success: true, message: "Dispute opened." };
            return { data: null, success: false, message: res.message || "Failed to open dispute." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Failed to open dispute." };
        }
    },
};
