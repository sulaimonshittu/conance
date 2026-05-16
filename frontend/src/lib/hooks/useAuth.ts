import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "@/lib/hooks/useAuthStore"
import { toast } from "sonner"

export const useAuth = () => {
    const navigate = useNavigate()
    const {
        isAuth,
        role,
        user,
        isLoading,
        error,
        requestOtp: storeRequestOtp,
        verifyOtp: storeVerifyOtp,
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

    const requestOtp = useCallback(async (phoneNumber: string) => {
        return await storeRequestOtp(phoneNumber)
    }, [storeRequestOtp])

    const verifyOtp = useCallback(async (phoneNumber: string, otp: string, role: "client" | "artisan") => {
        const success = await storeVerifyOtp(phoneNumber, otp, role)
        if (success) {
            toast.success(`Welcome back, ${role}!`)
            navigate(role === "artisan" ? "/artisan" : "/client")
        }
        return success
    }, [storeVerifyOtp, navigate])

    const logout = useCallback(async () => {
        await storeLogout()
        toast.info("Logged out successfully")
        navigate("/")
    }, [storeLogout, navigate])

    return {
        isAuth,
        role,
        user,
        isLoading,
        error,
        requestOtp,
        verifyOtp,
        logout
    }
}
