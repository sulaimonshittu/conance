import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "../api/auth.api"

interface UserDetails {
    id: string
    name: string
    phoneNumber: string
    email?: string
    avatar?: string
    walletBalance: number
    location?: string
    bio?: string
    // Artisan specific

    title?: string
    skills?: string[]
    portfolio?: string[]
    rating?: number
    reviewsCount?: number
}

interface AuthState {
    token: string | null
    role: "client" | "artisan" | null
    isAuth: boolean
    isLoading: boolean
    error: string | null
    user: UserDetails | null
    setRole: (role: "client" | "artisan" | null) => void
    setUser: (user: UserDetails | null) => void

    requestOtp: (phoneNumber: string) => Promise<boolean>
    verifyOtp: (phoneNumber: string, otp: string, selectedRole: "client" | "artisan") => Promise<boolean>

    logout: () => Promise<void>
    updateProfile: (data: Partial<UserDetails>) => void
    clearError: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            user: null,
            isAuth: false,
            isLoading: false,
            error: null,

            setRole: (role) => set({ role }),
            setUser: (user) => set({ user }),

            clearError: () => set({ error: null }),

            updateProfile: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null
            })),

            requestOtp: async (phoneNumber) => {
                set({ isLoading: true, error: null });
                const res = await authApi.requestOtp(phoneNumber);
                if (res.success) {
                    set({ isLoading: false });
                    return true;
                } else {
                    set({ error: res.message || "Failed to request OTP", isLoading: false });
                    return false;
                }
            },

            verifyOtp: async (phoneNumber, otp, selectedRole) => {
                set({ isLoading: true, error: null });
                const res = await authApi.verifyOtp(phoneNumber, otp);

                if (res.success && res.data) {
                    // Backend does not return a full profile yet, so we mock it for now.
                    // If backend returns role, we'd use it, but for now we use the selectedRole 
                    // if res.data.role is missing.
                    const role = res.data.role || selectedRole;

                    const mockUser: UserDetails = {
                        id: role == "artisan" ? "0191c955-0810-7e8c-8000-000000000002" : "0191c955-0810-7e8c-8000-000000000001",
                        name: role === "artisan" ? "Tunde Adeyemi" : "Jane Smith",
                        phoneNumber,
                        avatar: role === "artisan" ? "https://i.pravatar.cc/150?u=tunde" : "https://i.pravatar.cc/150?img=11",
                        walletBalance: role === "artisan" ? 45000 : 125000,
                        location: role === "artisan" ? "Lagos, Nigeria" : "Victoria Island, Lagos",
                        bio: role === "artisan" ? "Expert carpenter with 10+ years experience." : "Frequent user of Conance.",
                        title: role === "artisan" ? "Master Carpenter" : undefined,

                        skills: role === "artisan" ? ["Custom Furniture", "Wood Polishing", "Cabinetry"] : undefined,
                        rating: role === "artisan" ? 4.9 : undefined,
                        reviewsCount: role === "artisan" ? 127 : undefined,
                    };

                    set({
                        token: res.data.token,
                        role,
                        isAuth: true,
                        user: mockUser,
                        isLoading: false
                    });
                    return true;
                } else {
                    set({ error: res.message || "Invalid OTP", isLoading: false });
                    return false;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                await authApi.logout();
                set({ token: null, role: null, isAuth: false, user: null, isLoading: false, error: null });
            },
        }),
        {
            name: "auth-storage",
            // Persist token and essential auth state
            partialize: (state) => ({
                token: state.token,
                role: state.role,
                isAuth: state.isAuth,
                user: state.user
            }),
        }
    )
)

export default useAuthStore
