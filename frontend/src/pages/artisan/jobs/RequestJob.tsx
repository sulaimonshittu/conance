import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import JobRequestDetails from "@/lib/components/artisan/artisan-proposal/JobRequestDetails"
import GenerateProposal from "@/lib/components/artisan/artisan-proposal/GenerateProposal"
import { artisanApi } from "@/lib/api/artisan.api"
import type { DetailedRequest } from "@/lib/utils/mockData"
import { ChevronLeft, Info, Loader2 } from "lucide-react"
//import Button from "@/lib/components/common/Button"
import { toast } from "sonner"

const RequestJob = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [request, setRequest] = useState<DetailedRequest | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return
            setIsLoading(true)
            // Using artisanApi which we updated earlier to support fetching by ID
            const res = await artisanApi.getProjectById(id)
            if (res.success && res.data) {
                setRequest(res.data as DetailedRequest)
            } else {
                toast.error(res.message || "Request details not found")
            }
            setIsLoading(false)
        }
        fetchRequest()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (!request) {
        return (
            <div className="p-s3 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <Info size={48} className="text-gray-300 mb-s2" />
                <h2 className="text-h4 font-bold text-gray-900">Job details not found</h2>
                <button onClick={() => navigate(-1)} className="mt-s2 text-primary font-bold underline">Go Back</button>
            </div>
        )
    }

    return (
        <section className="bg-white min-h-screen pb-s5">
            {/* Header / Nav */}
            <div className="p-s3 flex items-center gap-s2 border-b border-accent/30 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-gray-600">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-b1 font-bold text-gray-900">
                    Job Request Details
                </h1>
            </div>

            <div className="p-s3 max-w-2xl mx-auto flex flex-col gap-s5">
                {/* Main Content Component */}
                <JobRequestDetails request={request} />

                {/* AI Proposal Section */}
                {id && <GenerateProposal id={id} />}

                <p className="text-[11px] text-text-muted text-center font-medium px-s4 -mt-s3">
                    By sending a proposal, you agree to Conance's terms for job delivery and platform fee deductions.
                </p>
            </div>
        </section>
    )
}

export default RequestJob