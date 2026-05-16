import { apiPost } from "./apiClient";
import type { ApiResponse } from "./apiUtils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface DisputeResolution {
    artisanPercentage: number;
    clientRefundPercentage: number;
}

export interface DisputeMediation {
    id: string;
    jobId: string;
    openerId: string;
    reason: string;
    status: "open" | "mediated" | "resolved";
    resolution?: DisputeResolution;
    createdAt: string;
}

// ─────────────────────────────────────────────
// Disputes API
// ─────────────────────────────────────────────

export const disputesApi = {
    /**
     * Open a dispute for a job.
     * POST /jobs/{id}/disputes
     * Body: { opener_id, reason }
     */
    openDispute: async (
        jobId: string,
        openerId: string,
        reason: string
    ): Promise<ApiResponse<DisputeMediation>> => {
        try {
            const res = await apiPost<DisputeMediation>(`/jobs/${jobId}/disputes`, {
                openerId,
                reason,
            });
            if (res.success) {
                return { data: res.data, success: true, message: "Dispute opened. Our AI mediator will review it shortly." };
            }
            return { data: null, success: false, message: res.message || "Failed to open dispute." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Network error while opening dispute." };
        }
    },

    /**
     * Accept the AI-proposed mediation resolution for a dispute.
     * POST /disputes/{id}/accept-mediation
     * Body: { actor_id, resolution: { artisan_percentage, client_refund_percentage } }
     */
    acceptMediation: async (
        disputeId: string,
        actorId: string,
        resolution: DisputeResolution
    ): Promise<ApiResponse<any>> => {
        try {
            const res = await apiPost<any>(`/disputes/${disputeId}/accept-mediation`, {
                actorId,
                resolution,
            });
            if (res.success) {
                return { data: res.data, success: true, message: "Mediation accepted. Funds will be distributed shortly." };
            }
            return { data: null, success: false, message: res.message || "Failed to accept mediation." };
        } catch (err: any) {
            return { data: null, success: false, message: err.message || "Network error while accepting mediation." };
        }
    },
};
