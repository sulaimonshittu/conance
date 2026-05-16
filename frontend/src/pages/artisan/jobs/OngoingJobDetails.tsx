import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import { ChevronLeft, CheckCircle2, Clock, ShieldCheck, Info, Loader2, PlayCircle, AlertTriangle } from "lucide-react"
import Button from "@/lib/components/common/Button"
import { artisanApi } from "@/lib/api/artisan.api"
import type { ActiveProject } from "@/lib/utils/mockData"
import { toast } from "sonner"
import { jobActionsApi } from "@/lib/api/jobActions.api"
import useAuthStore from "@/lib/hooks/useAuthStore"
import ModalMobile from "@/lib/components/common/modals/ModalMobile"
import DisputeModal from "@/lib/components/common/modals/DisputeModal"

const OngoingJobDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState<ActiveProject | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMarkingInProgress, setIsMarkingInProgress] = useState(false)
    const [showDispute, setShowDispute] = useState(false)
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return
            setIsLoading(true)
            const res = await artisanApi.getProjectById(id)
            if (res.success && res.data) {
                setProject(res.data as ActiveProject)
            } else {
                toast.error(res.message || "Failed to load project")
            }
            setIsLoading(false)
        }
        fetchProject()
    }, [id])

    const handleMarkInProgress = async () => {
        if (!project) return
        setIsMarkingInProgress(true)
        const res = await artisanApi.markJobInProgress(project.id.toString())
        setIsMarkingInProgress(false)
        if (res.success) {
            toast.success("Job marked as in-progress! Client has been notified.")
            // Reflect locally: move first pending milestone to in-progress
            setProject(prev => {
                if (!prev) return prev
                const milestones = [...prev.milestones]
                const firstPending = milestones.findIndex(m => m.status === "pending")
                if (firstPending !== -1) milestones[firstPending] = { ...milestones[firstPending], status: "in-progress" }
                return { ...prev, milestones }
            })
        } else {
            toast.error(res.message || "Failed to mark job as in-progress.")
        }
    }

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

    const progressPercentage = Math.round((project.releasedAmount / project.totalAmount) * 100)
    const hasStarted = project.milestones.some(m => m.status === "in-progress" || m.status === "released")

    return (
        <>
            <section className="bg-slate-50 min-h-screen pb-24">
                {/* Header */}
                <div className="bg-white p-s3 border-b border-accent sticky top-0 z-10">
                    <button onClick={() => navigate(-1)} className="mb-s2 flex items-center gap-1 text-primary font-bold text-b3">
                        <ChevronLeft size={20} />
                        Back to Work
                    </button>
                    <div className="flex items-center gap-s2 mt-s2">
                        <img src={project.customerAvatar} className="w-15 h-15 rounded-full border border-accent shadow-sm" alt="" />
                        <div>
                            <h1 className="font-serif text-h3 font-extrabold text-gray-900 leading-tight">{project.title}</h1>
                            <p className="text-b3 text-gray-900 font-bold leading-none">{project.customerName}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight mt-0.5">Client</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-s2">
                        <Button
                            onClick={() => navigate(`/artisan/chat`)}
                            variant="outline"
                            className="flex-1"
                        >
                            Chat with Client
                        </Button>
                        <button
                            onClick={() => setShowDispute(true)}
                            className="px-3 py-2 border border-warning/30 bg-orange-50 text-warning rounded-xl text-[12px] font-bold hover:bg-orange-100 transition-colors flex items-center gap-1"
                        >
                            <AlertTriangle size={14} />
                            Dispute
                        </button>
                    </div>
                </div>

                <div className="p-s3">
                    {/* Overall Progress Card */}
                    <div className="bg-white p-s3 rounded-2xl border border-accent shadow-sm mb-s4">
                        <div className="flex justify-between items-end mb-s2">
                            <div>
                                <p className="text-b4 text-text-muted font-bold uppercase tracking-widest mb-1">Total Progress</p>
                                <p className="text-h3 font-bold text-gray-900">{progressPercentage}% Completed</p>
                            </div>
                            <div className="text-right">
                                <p className="text-b3 font-bold text-primary">{formatNaira(project.releasedAmount)}</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase">of {formatNaira(project.totalAmount)}</p>
                            </div>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-accent/20">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-[11px] text-[#3B7A5F] font-bold bg-[#F0F4F2] px-3 py-2 rounded-xl">
                            <ShieldCheck size={14} />
                            Client payment is held securely in escrow
                        </div>
                    </div>

                    {/* Mark In-Progress CTA (only if not yet started) */}
                    {!hasStarted && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-s3 mb-s4">
                            <p className="text-[13px] text-blue-800 font-medium mb-3 leading-relaxed">
                                Ready to start? Let the client know you've begun work on this job.
                            </p>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleMarkInProgress}
                                isLoading={isMarkingInProgress}
                                loadingText="Updating..."
                                leftIcon={<PlayCircle size={18} />}
                            >
                                Mark as In-Progress
                            </Button>
                        </div>
                    )}

                    {/* Milestones */}
                    <h2 className="text-b3 font-bold text-gray-900 mb-s3 uppercase tracking-tight flex items-center gap-2">
                        Project Milestones
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px]">{project.milestones.length}</span>
                    </h2>

                    <div className="space-y-s3">
                        {project.milestones.map((milestone) => (
                            <div key={milestone.id} className="bg-white rounded-2xl border border-accent shadow-sm overflow-hidden">
                                <div className="p-s3 flex items-start justify-between border-b border-accent/50">
                                    <div className="flex gap-s2">
                                        <div className={`mt-1 ${milestone.status === 'released' ? 'text-green-600' :
                                            milestone.status === 'in-progress' ? 'text-blue-500' : 'text-gray-300'
                                            }`}>
                                            {milestone.status === 'released' ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                                        </div>
                                        <div>
                                            <h3 className="text-b2 font-bold text-gray-900 leading-tight mb-0.5">{milestone.title}</h3>
                                            <p className="text-b3 text-text-muted font-medium">{formatNaira(milestone.amount)}</p>
                                        </div>
                                    </div>

                                    <span className={`px-s2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${milestone.status === 'released' ? 'bg-green-50 text-green-700 border-green-100' :
                                        milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                        {milestone.status === 'released' ? 'Approved & Released' : milestone.status.replace('-', ' ')}
                                    </span>
                                </div>

                                {/* Released breakdown */}
                                {milestone.status === 'released' && (
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
                                            <div className="pl-s3 border-l-2 border-accent/60 space-y-s2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-b3 text-gray-700 font-medium">↳ {formatNaira(milestone.artisanAmount || 0)} to your wallet</span>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-accent">90%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-b3 text-gray-700 font-medium">↳ {formatNaira(milestone.platformFee || 0)} platform fee</span>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-accent">10%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit work CTA */}
                                {milestone.status === 'in-progress' && (
                                    <div className="p-s3 bg-blue-50/20">
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            size="sm"
                                            onClick={async () => {
                                                const artisanId = user?.id || "artisan-id"
                                                const res = await jobActionsApi.submitWork(project.id.toString(), artisanId, [], "Work submitted")
                                                if (res.success) {
                                                    toast.success("Work submitted! Awaiting client approval.")
                                                    setProject(prev => {
                                                        if (!prev) return prev
                                                        return {
                                                            ...prev,
                                                            milestones: prev.milestones.map(m =>
                                                                m.id === milestone.id ? { ...m, status: 'pending' as any } : m
                                                            )
                                                        }
                                                    })
                                                } else {
                                                    toast.error(res.message)
                                                }
                                            }}
                                        >
                                            Submit Work for Review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dispute Modal */}
            {showDispute && user && (
                <ModalMobile
                    onClose={() => setShowDispute(false)}
                    direction="bottom"
                    Content={() => (
                        <DisputeModal
                            jobId={project.id.toString()}
                            openerId={user.id}
                            onClose={() => setShowDispute(false)}
                        />
                    )}
                />
            )}
        </>
    )
}

export default OngoingJobDetails