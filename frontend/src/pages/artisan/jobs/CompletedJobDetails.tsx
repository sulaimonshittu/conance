import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import { ChevronLeft, CheckCircle2, ShieldCheck, Info, Star, Loader2 } from "lucide-react"
import Button from "@/lib/components/common/Button"
import { artisanApi } from "@/lib/api/artisan.api"
import type { FinishedProject } from "@/lib/utils/mockData"
import { toast } from "sonner"

const CompletedJobDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState<FinishedProject | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return
            setIsLoading(true)
            const res = await artisanApi.getProjectById(id)
            if (res.success && res.data) {
                setProject(res.data as FinishedProject)
            } else {
                toast.error(res.message || "Failed to load project history")
            }
            setIsLoading(false)
        }
        fetchProject()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="p-s3 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <Info size={48} className="text-gray-300 mb-s2" />
                <h2 className="text-h4 font-bold text-gray-900">Project not found</h2>
                <button onClick={() => navigate(-1)} className="mt-s2 text-primary font-bold">Go Back</button>
            </div>
        )
    }

    return (
        <section className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-s3 border-b border-accent sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mb-s2 flex items-center gap-1 text-primary font-bold text-b3">
                    <ChevronLeft size={20} />
                    Back to History
                </button>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-s1 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                        Project Completed
                    </span>
                    <span className="text-[10px] text-text-muted font-bold">
                        {new Date(project.completedDate).toLocaleDateString('en-NG', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <h1 className="font-serif text-h3 font-extrabold text-gray-900 leading-tight">
                    {project.title}
                </h1>
                <div className="flex items-center gap-s2 mt-s2">
                    <img src={project.customerAvatar} className="w-8 h-8 rounded-full border border-accent shadow-sm" alt="" />
                    <div>
                        <p className="text-b3 text-gray-900 font-bold leading-none">{project.customerName}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight mt-0.5">Client</p>
                    </div>
                </div>
            </div>

            <div className="p-s3">
                {/* Financial Summary Card */}
                <div className="bg-white p-s3 rounded-2xl border border-accent shadow-sm mb-s5">
                    <p className="text-b4 text-text-muted font-bold uppercase tracking-widest mb-s2">Total Earnings</p>
                    <div className="flex justify-between items-center">
                        <p className="text-h2 font-extrabold text-green-600 leading-none">
                            {formatNaira(project.totalAmount)}
                        </p>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-green-700 font-bold uppercase bg-green-50 px-2 py-0.5 rounded border border-green-100">Fully Paid</span>
                            <span className="text-[10px] text-text-muted mt-1 font-medium">Squad Secure</span>
                        </div>
                    </div>
                </div>

                {/* Success Banner */}
                <div className="bg-green-600 rounded-2xl p-s3 text-white mb-s5 flex items-center gap-s3 shadow-lg shadow-green-900/10">
                    <div className="bg-white/20 p-s2 rounded-full">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-b2 font-bold leading-tight">Excellent Work!</h3>
                        <p className="text-[11px] text-white/80 font-medium leading-relaxed">You've successfully completed this project and all funds have been released to your wallet.</p>
                    </div>
                </div>

                <h2 className="text-b3 font-bold text-gray-900 mb-s3 uppercase tracking-tight flex items-center gap-2">
                    Payment Milestones
                    <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px]">{project.milestones.length}</span>
                </h2>
                
                <div className="space-y-s3">
                    {project.milestones.map((milestone) => (
                        <div key={milestone.id} className="bg-white rounded-2xl border border-accent shadow-sm overflow-hidden">
                            <div className="p-s3 flex items-start justify-between border-b border-accent/50">
                                <div className="flex gap-s2">
                                    <div className="mt-1 text-green-600">
                                        <CheckCircle2 size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-b2 font-bold text-gray-900 leading-tight mb-0.5">{milestone.title}</h3>
                                        <p className="text-b3 text-text-muted font-medium">{formatNaira(milestone.amount)}</p>
                                    </div>
                                </div>
                                
                                <span className="px-s2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Released
                                </span>
                            </div>

                            <div className="p-s3 bg-slate-50/50">
                                <div className="flex items-center gap-s1 text-b4 text-green-700 font-bold mb-s3">
                                    <ShieldCheck size={16} />
                                    <span>{milestone.releaseDate}</span>
                                </div>
                                
                                <div className="space-y-s3">
                                    <div className="flex items-start gap-s2 text-[11px] text-text-muted font-medium leading-relaxed">
                                        <Info size={14} className="shrink-0 mt-0.5" />
                                        <span>{milestone.paymentDetails}</span>
                                    </div>
                                    
                                    <div className="pl-s3 border-l-2 border-green-200 space-y-s2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-b3 text-gray-700 font-medium">↳ {formatNaira(milestone.artisanAmount)} to your wallet</span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-accent">90%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-b3 text-gray-700 font-medium">↳ {formatNaira(milestone.platformFee)} platform fee</span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-accent">10%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-s5">
                    <Button variant="outline" fullWidth onClick={() => navigate('/artisan/earnings')}>
                        View in Earnings
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CompletedJobDetails