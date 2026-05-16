import { apiPost } from "./apiClient";
import type { ApiResponse } from "./apiUtils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BankAccountInfo {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName?: string;
}

// Common Nigerian banks for the UI picker
export const NIGERIAN_BANKS: { name: string; code: string }[] = [
    { name: "Access Bank", code: "044" },
    { name: "GTBank", code: "058" },
    { name: "First Bank", code: "011" },
    { name: "Zenith Bank", code: "057" },
    { name: "UBA", code: "033" },
    { name: "Fidelity Bank", code: "070" },
    { name: "Stanbic IBTC", code: "221" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank", code: "032" },
    { name: "Wema Bank / ALAT", code: "035" },
    { name: "Kuda Bank", code: "090267" },
    { name: "OPay", code: "999992" },
    { name: "Palmpay", code: "999991" },
    { name: "Moniepoint", code: "50515" },
];

// ─────────────────────────────────────────────
// Payout API
// ─────────────────────────────────────────────

export const payoutApi = {
    /**
     * Verify a bank account number against its bank code (KYC via Squad).
     * POST /payout/account/lookup
     * Body: { bank_code, account_number }
     * Returns the resolved account name from the bank.
     */
    lookupAccount: async (
        bankCode: string,
        accountNumber: string
    ): Promise<ApiResponse<BankAccountInfo>> => {
        try {
            const res = await apiPost<any>("/payout/account/lookup", {
                bankCode,
                accountNumber,
            });

            if (res.success && res.data) {
                const info: BankAccountInfo = {
                    accountName: res.data.accountName ?? res.data.account_name ?? "",
                    accountNumber,
                    bankCode,
                    bankName: NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name,
                };
                return { data: info, success: true };
            }

            return {
                data: null,
                success: false,
                message: res.message || "Account not found. Check account number and bank.",
            };
        } catch (err: any) {
            return {
                data: null,
                success: false,
                message: err.message || "Network error during account lookup.",
            };
        }
    },
};
