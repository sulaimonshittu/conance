import { apiPost } from "./apiClient";
import type { ApiResponse } from "./apiUtils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UserDetails {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    userType: "client" | "artisan";
    profilePhotoUrl?: string;
    isVerified?: boolean;
    email?: string;
}

export interface AuthUser {
    id: string;
    phoneNumber: string;
    name?: string;
    avatar?: string;
    walletBalanceKobo: number;
    // ... we can extend this as needed
}

export interface VerifyOtpResponse {
    token: string;
    role: "artisan" | "client";
    message: string;
}

export const authApi = {
    requestOtp: async (phoneNumber: string): Promise<ApiResponse<any>> => {
        return apiPost("/auth/otp", { phoneNumber });
    },

    verifyOtp: async (phoneNumber: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> => {
        return apiPost("/auth/verify", { phoneNumber, otp });
    },

    // Kept as stub for components that haven't migrated to OTP yet
    login: async (_email: string, _role: "artisan" | "client") => {
        console.warn("authApi.login is deprecated. Use requestOtp/verifyOtp instead.");
        return { success: false, message: "Deprecated", data: null };
    },

    register: async (_name: string, _email: string, _role: "artisan" | "client") => {
        console.warn("authApi.register is deprecated. Use requestOtp/verifyOtp instead.");
        return { success: false, message: "Deprecated", data: null };
    },

    logout: async () => {
        // Typically handled client-side by clearing tokens, 
        // but can be hooked up to a real endpoint later if added.
        return { success: true, message: "Logged out", data: null };
    }
};
