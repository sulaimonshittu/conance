import { useEffect } from "react"
import useArtisanStore from "@/lib/hooks/useArtisanStore"
import PendingRequestCard from "./PendingRequestCard"
import { Loader2, Info } from "lucide-react"
import { toast } from "sonner"

const PendingRequests = () => {
    const {
        pendingProposals,
        isLoading,
        fetchPendingProposals,
        cancelProposal
    } = useArtisanStore()

    useEffect(() => {
        fetchPendingProposals()
    }, [])

    const handleCancel = async (id: string | number) => {
        const success = await cancelProposal(id)
        if (success) {
            toast.success("Proposal cancelled successfully")
        } else {
            toast.error("Failed to cancel proposal")
        }
    }

    if (isLoading && pendingProposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-s5">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="mt-s2 text-b3 text-text-muted font-medium">Loading proposals...</p>
            </div>
        )
    }

    if (pendingProposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-s5 px-s4 text-center">
                <div className="bg-slate-50 p-s3 rounded-full mb-s2">
                    <Info size={32} className="text-gray-400" />
                </div>
                <h3 className="text-b1 font-bold text-gray-900">No pending proposals</h3>
                <p className="text-b3 text-text-muted mt-1 max-w-[250px]">
                    You haven't sent any proposals yet. Check the job search tab for new opportunities.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-s3 px-s3">
            {pendingProposals.map((proposal) => (
                <PendingRequestCard
                    key={proposal.id}
                    request={proposal}
                    onCancel={handleCancel}
                    isCancelling={isLoading} // The store sets isLoading during cancelProposal
                />
            ))}
        </div>
    )
}

export default PendingRequests