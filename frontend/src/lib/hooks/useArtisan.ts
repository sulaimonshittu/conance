import { useEffect } from "react"
import useArtisanStore from "./useArtisanStore"
import { toast } from "sonner"

export const useArtisan = () => {
    const { 
        activeProjects, 
        finishedProjects, 
        requests, 
        transactions, 
        isLoading, 
        error,
        fetchDashboardData,
        fetchProjects,
        fetchRequests,
        fetchEarnings,
        clearError
    } = useArtisanStore()

    useEffect(() => {
        if (error) {
            toast.error(error)
            clearError()
        }
    }, [error, clearError])

    return {
        activeProjects,
        finishedProjects,
        requests,
        transactions,
        isLoading,
        fetchDashboardData,
        fetchProjects,
        fetchRequests,
        fetchEarnings
    }
}
