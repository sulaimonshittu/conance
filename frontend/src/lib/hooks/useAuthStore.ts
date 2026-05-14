import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
    role: "client" | "artisan" | null
    isAuth: boolean
    userDetails: {
        name: string
        email: string
    } | null
    setRole: (role: "client" | "artisan" | null) => void
    loginAsArtisan: (data: { password: string, email: string }) => void
    loginAsClient: (data: { password: string, email: string }) => void
    registerAsArtisan: (data: { name: string, email: string }) => void
    registerAsClient: (data: { name: string, email: string }) => void
    logout: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: null,
            userDetails: null,
            isAuth: false,
            setRole: (role) => set({ role }),
            loginAsArtisan: (data: { password: string, email: string }) => { set({ role: "artisan", isAuth: true, userDetails: { name: "randomName", email: data.email } }) },
            loginAsClient: (data: { password: string, email: string }) => set({ role: "client", isAuth: true, userDetails: { name: "randomName", email: data.email } }),
            registerAsArtisan: (data: { name: string, email: string }) => set({ role: "artisan", isAuth: true, userDetails: data }),
            registerAsClient: (data: { name: string, email: string }) => set({ role: "client", isAuth: true, userDetails: data }),
            logout: () => set({ role: null, isAuth: false, userDetails: null }),
        }),
        {
            name: "auth-storage",
        }
    )
)

export default useAuthStore