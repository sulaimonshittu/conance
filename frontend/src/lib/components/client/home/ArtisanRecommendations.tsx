import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Loader2, Star, CheckCircle } from "lucide-react"
import { jobApi, type AIRecommendation } from "@/lib/api/job.api"
import { useAuth } from "@/lib/hooks/useAuth"

const ArtisanRecommendations = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [artisans, setArtisans] = useState<AIRecommendation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [openJobId, setOpenJobId] = useState<string | null>(null)

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user?.id) return
            setIsLoading(true)

            // 1. Find an "open" job for this client to get relevant recommendations
            const jobsRes = await jobApi.getClientJobs(user.id)
            if (jobsRes.success && jobsRes.data) {
                const openJob = jobsRes.data.find(j => j.status === "open")
                if (openJob) {
                    setOpenJobId(openJob.id)
                    // 2. Fetch recommendations for that specific job
                    const recRes = await jobApi.fetchRecommendations(openJob.id)
                    if (recRes.success && recRes.data) {
                        setArtisans(recRes.data.slice(0, 3))
                    }
                }
            }
            setIsLoading(false)
        }
        fetchRecommendations()
    }, [user?.id])

    if (isLoading) {
        return (
            <div className="flex flex-col gap-s3 py-s3 px-s3">
                <div className="flex justify-center py-s5">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>
        )
    }

    if (!openJobId || artisans.length === 0) return null

    return (
        <section className="flex flex-col gap-s3 px-s3 w-full mt-s4 mb-s4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    <h2 className="font-bold text-h3 text-gray-900">Recommended Artisans</h2>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x">
                {artisans.map((artisan, idx) => (
                    <div
                        key={idx}
                        className="snap-start flex-shrink-0 w-[260px] bg-white p-s3 rounded-[24px] border border-accent shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={artisan.artisanAvatar || `https://i.pravatar.cc/150?u=${artisan.artisanId}`}
                                alt={artisan.artisanName}
                                className="w-12 h-12 rounded-full object-cover border border-accent"
                            />
                            <div>
                                <h3 className="font-bold text-b1 text-gray-900 line-clamp-1">{artisan.artisanName}</h3>
                                <p className="text-[12px] text-text-muted font-medium line-clamp-1">{artisan.artisanTitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center bg-success/10 text-success px-2 py-1 rounded-md text-[11px] font-bold">
                                <CheckCircle size={12} className="mr-1" />
                                {artisan.matchScore}% Match
                            </div>
                            <div className="flex items-center bg-[#FFF8E6] text-[#B8860B] px-2 py-1 rounded-md text-[11px] font-bold">
                                <Star size={12} className="mr-1 fill-[#B8860B]" />
                                Top Rated
                            </div>
                        </div>

                        <p className="text-[12px] text-gray-600 font-medium line-clamp-2 mb-4 leading-relaxed">
                            {artisan.reasoning}
                        </p>

                        <button
                            onClick={() => navigate(`/client/job-posting/${openJobId}/recommendations`)}
                            className="w-full bg-[#FCF9F6] text-primary font-bold text-[13px] py-2.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ArtisanRecommendations
