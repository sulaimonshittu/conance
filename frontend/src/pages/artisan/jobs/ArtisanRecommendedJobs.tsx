import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Loader2, RefreshCcw, MapPin, Clock } from "lucide-react"
import { artisanApi } from "@/lib/api/artisan.api"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import type { DetailedRequest } from "@/lib/utils/mockData"
import useAuthStore from "@/lib/hooks/useAuthStore"
import { toast } from "sonner"

/**
 * ArtisanRecommendedJobs
 * Shows AI-ranked job recommendations from GET /artisans/{id}/recommendations.
 * Falls back to mock data when the backend is unavailable.
 */
const ArtisanRecommendedJobs = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [jobs, setJobs] = useState<DetailedRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRecommendations = async () => {
        if (!user?.id) return
        setIsLoading(true)
        setError(null)
        const res = await artisanApi.fetchJobRecommendations(user.id)
        if (res.success && res.data) {
            setJobs(res.data as DetailedRequest[])
        } else {
            setError(res.message || "Failed to load recommendations.")
            toast.error("Could not load recommended jobs.")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchRecommendations()
    }, [user?.id])

    return (
        <section className="min-h-screen bg-[#FCF9F6] pb-24">
            {/* Header */}
            <div className="px-s3 pt-s4 pb-s3 bg-white border-b border-accent/10 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Sparkles size={18} className="text-primary" />
                        </div>
                        <h1 className="text-h4 font-bold text-gray-900">Recommended for You</h1>
                    </div>
                    <button
                        onClick={fetchRecommendations}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        title="Refresh recommendations"
                    >
                        <RefreshCcw size={18} className={`text-text-muted ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
                <p className="text-[12px] text-text-muted font-medium ml-10">
                    AI-matched jobs based on your skills &amp; location
                </p>
            </div>

            <div className="px-s3 py-s3">
                {isLoading ? (
                    /* Loading */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={36} className="text-primary animate-spin" />
                        <p className="text-b3 text-text-muted font-medium">Finding the best matches...</p>
                    </div>
                ) : error ? (
                    /* Error */
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <Sparkles size={28} className="text-error" />
                        </div>
                        <p className="text-b2 font-bold text-gray-900">Could not load recommendations</p>
                        <p className="text-b3 text-text-muted max-w-[240px]">{error}</p>
                        <button
                            onClick={fetchRecommendations}
                            className="mt-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary2 transition-all active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    /* Empty */
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                            <Sparkles size={28} className="text-primary/40" />
                        </div>
                        <p className="text-b2 font-bold text-gray-900">No recommendations yet</p>
                        <p className="text-b3 text-text-muted max-w-[240px]">
                            Complete your profile with skills &amp; location to get AI-matched job recommendations.
                        </p>
                    </div>
                ) : (
                    /* Job list */
                    <div className="flex flex-col gap-s3">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-[1.75rem] border border-accent/10 shadow-sm p-s3 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
                                onClick={() => navigate(`/artisan/request-job/${job.id}`)}
                            >
                                {/* AI badge */}
                                <div className="flex items-center gap-1.5 mb-s2">
                                    <Sparkles size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Recommended</span>
                                </div>

                                {/* Header */}
                                <div className="flex items-start justify-between mb-s2">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={job.customerAvatar}
                                            alt={job.customerName}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div>
                                            <h3 className="text-b2 font-bold text-gray-900 leading-tight">{job.title}</h3>
                                            <p className="text-[12px] text-text-muted font-medium">{job.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-b2 font-bold text-primary">{formatNaira(job.totalAmount)}</p>
                                        <p className="text-[10px] text-text-muted font-medium">Est. budget</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 mb-s2">
                                    {job.description}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} className="text-primary" />
                                        <span>{job.distance} km away</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>
                                            {job.createdAt instanceof Date
                                                ? job.createdAt.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
                                                : String(job.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Milestones preview */}
                                {job.proposedMilestones?.length > 0 && (
                                    <div className="mt-s2 pt-s2 border-t border-accent/20">
                                        <div className="flex gap-2 flex-wrap">
                                            {job.proposedMilestones.slice(0, 2).map((m, i) => (
                                                <span key={i} className="text-[11px] bg-[#FFF3EE] text-primary px-2.5 py-1 rounded-full font-medium border border-primary/10">
                                                    {m.title}
                                                </span>
                                            ))}
                                            {job.proposedMilestones.length > 2 && (
                                                <span className="text-[11px] bg-gray-100 text-text-muted px-2.5 py-1 rounded-full font-medium">
                                                    +{job.proposedMilestones.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ArtisanRecommendedJobs
