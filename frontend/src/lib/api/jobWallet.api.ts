import { mockResponse, delay, type ApiResponse } from "./apiUtils";
import type { JobWallet } from "@/lib/utils/mockData";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface PublishedJobResult {
    id: string;
    status: "published";
}

// ─────────────────────────────────────────────
// Job Wallet API (mock – swap for real endpoints)
// ─────────────────────────────────────────────

export const jobWalletApi = {
    /**
     * Create a dedicated escrow wallet for a newly drafted job.
     * Real endpoint: POST /jobs/:jobId/wallet
     */
    createJobWallet: async (
        jobId: string,
        estimatedBudget: number
    ): Promise<ApiResponse<JobWallet>> => {
        await delay(1200);
        const accountNumber = `90${Math.floor(Math.random() * 90000000 + 10000000)}`;
        const wallet: JobWallet = {
            id: `wallet_${Date.now()}`,
            jobId,
            fundedAmount: 0,
            estimatedBudget,
            lockedFunds: 0,
            status: "pending",
            virtualAccount: {
                bankName: "Wema Bank",
                accountNumber,
                accountName: `Conance Escrow — Job #${jobId.slice(-6).toUpperCase()}`,
            },
        };
        return mockResponse(wallet, true, "", 0);
    },

    /**
     * Confirm that the user has made a bank transfer to the virtual account.
     * In production this would be a webhook/polling mechanism.
     * Real endpoint: POST /job-wallets/:walletId/confirm-funding
     */
    confirmFunding: async (walletId: string, estimatedBudget: number): Promise<ApiResponse<JobWallet>> => {
        await delay(2000);
        // Simulate 5% failure (transfer not yet confirmed)
        if (Math.random() < 0.05) {
            return mockResponse<JobWallet>(
                null,
                false,
                "Transfer not yet confirmed. Please wait a few minutes and try again.",
                0
            );
        }
        const wallet: JobWallet = {
            id: walletId,
            jobId: "",
            fundedAmount: estimatedBudget,
            estimatedBudget,
            lockedFunds: estimatedBudget,
            status: "funded",
            virtualAccount: { bankName: "", accountNumber: "", accountName: "" },
        };
        return mockResponse(wallet, true, "Wallet funded successfully!", 0);
    },

    /**
     * Publish a funded job so it becomes visible to artisans.
     * Real endpoint: POST /jobs/:jobId/publish
     */
    publishJob: async (jobId: string): Promise<ApiResponse<PublishedJobResult>> => {
        await delay(1500);
        if (Math.random() < 0.05) {
            return mockResponse<PublishedJobResult>(null, false, "Failed to publish job. Please try again.", 0);
        }
        return mockResponse({ id: jobId, status: "published" }, true, "Job published!", 0);
    },
};
