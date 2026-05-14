import { create } from 'zustand'
import { artisanApi } from '../api/artisan.api'

interface WalletSummary {
    escrow: number;
    released: number;
    balance: number;
    accountDetails: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

interface WalletState {
    summary: WalletSummary | null;
    isLoading: boolean;
    error: string | null;
    
    fetchSummary: () => Promise<void>;
    fundWallet: (amount: number) => Promise<boolean>;
}

const useWalletStore = create<WalletState>((set) => ({
    summary: null,
    isLoading: false,
    error: null,

    fetchSummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await artisanApi.getWalletSummary();
            if (res.success && res.data) {
                set({ summary: res.data, isLoading: false });
            } else {
                set({ error: res.message || "Failed to load wallet data", isLoading: false });
            }
        } catch (err: any) {
            set({ error: err.message || "An unexpected error occurred", isLoading: false });
        }
    },

    fundWallet: async (amount: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await artisanApi.fundWallet(amount);
            if (res.success) {
                set({ isLoading: false });
                return true;
            } else {
                set({ error: res.message || "Funding failed", isLoading: false });
                return false;
            }
        } catch (err: any) {
            set({ error: err.message || "An unexpected error occurred", isLoading: false });
            return false;
        }
    }
}));

export default useWalletStore;
