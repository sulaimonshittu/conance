import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "@/lib/hooks/useAuthStore"
import { toast } from "sonner"

export const useAuth = () => {
    const navigate = useNavigate()
    const {
        isAuth,
        role,
        userDetails,
        isLoading,
        error,
        login: storeLogin,
        register: storeRegister,
        logout: storeLogout,
        clearError
    } = useAuthStore()

    // Handle global errors from the store
    useEffect(() => {
        if (error) {
            toast.error(error)
            clearError()
        }
    }, [error, clearError])

    const login = useCallback(async (email: string, password: string, role: "client" | "artisan") => {
        const success = await storeLogin(email, password, role)
        if (success) {
            toast.success(`Welcome back, ${role}!`)
            navigate(role === "artisan" ? "/artisan" : "/client")
        }
        return success
    }, [storeLogin, navigate])

    const register = useCallback(async (name: string, email: string, role: "client" | "artisan") => {
        const success = await storeRegister(name, email, role)
        if (success) {
            toast.success("Account created successfully!")
            navigate(role === "artisan" ? "/artisan" : "/client")
        }
        return success
    }, [storeRegister, navigate])

    const logout = useCallback(async () => {
        await storeLogout()
        toast.info("Logged out successfully")
        navigate("/")
    }, [storeLogout, navigate])

    return {
        isAuth,
        role,
        userDetails,
        isLoading,
        login,
        register,
        logout
    }
}
