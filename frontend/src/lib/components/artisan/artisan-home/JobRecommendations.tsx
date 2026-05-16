import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Loader2, MapPin, Clock } from "lucide-react"
import { artisanApi } from "@/lib/api/artisan.api"
import type { DetailedRequest } from "@/lib/utils/mockData"
import { useAuth } from "@/lib/hooks/useAuth"
import Button from "@/lib/components/common/Button"

// Utility to format currency since it might be missing
const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}

const JobRecommendations = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [jobs, setJobs] = useState<DetailedRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecs = async () => {
            if (!user?.id) return
            setIsLoading(true)
            const res = await artisanApi.fetchJobRecommendations(user.id)
            if (res.success && res.data) {
                setJobs((res.data as DetailedRequest[]).slice(0, 3))
            }
            setIsLoading(false)
        }
        fetchRecs()
    }, [user?.id])

    if (isLoading && jobs.length === 0) {
        return (
            <div className="flex flex-col gap-s3 py-s3">
                <div className="flex justify-center py-s5">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>
        )
    }

    if (jobs.length === 0) return null

    return (
        <section className="flex flex-col gap-s2 w-full mt-s4 mb-s4">
            <div className="flex justify-between items-center mb-s2">
                <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    <h2 className="font-bold text-h3 text-gray-900">Recommended for You</h2>
                </div>
                <Button
                    variant="ghost"
                    className="text-primary text-b2 hover:bg-transparent"
                    onClick={() => navigate('/artisan/requests')}
                >
                    View All
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        onClick={() => navigate(`/artisan/request-job/${job.id}`)}
                        className="bg-white p-s3 rounded-2xl border border-accent shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-b1 text-gray-900 leading-tight">{job.title}</h3>
                            <span className="text-primary font-bold text-b3">{formatNaira(job.totalAmount)}</span>
                        </div>
                        <p className="text-b3 text-text-muted line-clamp-2 mb-3">{job.description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-text-muted font-bold">
                            <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span>{job.distance}km away</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{typeof job.createdAt === 'string' ? job.createdAt : 'Just now'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default JobRecommendations
