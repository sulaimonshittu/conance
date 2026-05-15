import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi } from "../api/auth.api"

interface AuthState {
    role: "client" | "artisan" | null
    isAuth: boolean
    isLoading: boolean
    error: string | null
    userDetails: {
        name: string
        email: string
    } | null
    setRole: (role: "client" | "artisan" | null) => void
    login: (email: string, password: string, role: "client" | "artisan") => Promise<boolean>
    register: (name: string, email: string, role: "client" | "artisan") => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: null,
            userDetails: null,
            isAuth: false,
            isLoading: false,
            error: null,

            setRole: (role) => set({ role }),

            clearError: () => set({ error: null }),

            login: async (email, _password, role) => {
                set({ isLoading: true, error: null });
                const res = await authApi.login(email, role);
                if (res.success && res.data) {
                    set({ 
                        role: res.data.role, 
                        isAuth: true, 
                        userDetails: res.data.userDetails,
                        isLoading: false 
                    });
                    return true;
                } else {
                    set({ error: res.message || "Login failed", isLoading: false });
                    return false;
                }
            },

            register: async (name, email, role) => {
                set({ isLoading: true, error: null });
                const res = await authApi.register(name, email, role);
                if (res.success && res.data) {
                    set({ 
                        role: res.data.role, 
                        isAuth: true, 
                        userDetails: res.data.userDetails,
                        isLoading: false 
                    });
                    return true;
                } else {
                    set({ error: res.message || "Registration failed", isLoading: false });
                    return false;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                await authApi.logout();
                set({ role: null, isAuth: false, userDetails: null, isLoading: false, error: null });
            },
        }),
        {
            name: "auth-storage",
            // Only persist essential auth state
            partialize: (state) => ({ 
                role: state.role, 
                isAuth: state.isAuth, 
                userDetails: state.userDetails 
            }),
        }
    )
)

export default useAuthStore