import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MOCK_CLIENT_JOBS, type ClientJob } from '@/lib/utils/mockData'
import {
    ChevronLeft,
    MessageCircle,
    CheckCircle2,
    Clock,
    ShieldCheck,
    MoreVertical,
    Star,
    ArrowRight,
    AlertTriangle,
    Loader2
} from 'lucide-react'
import { jobActionsApi } from '@/lib/api/jobActions.api'
import { toast } from 'sonner'
import useAuthStore from '@/lib/hooks/useAuthStore'
import ModalMobile from '@/lib/components/common/modals/ModalMobile'
import DisputeModal from '@/lib/components/common/modals/DisputeModal'

const JobDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [job, setJob] = useState<ClientJob | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isReleasing, setIsReleasing] = useState(false)
    const [showDispute, setShowDispute] = useState(false)
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 600))
            const foundJob = MOCK_CLIENT_JOBS.find(j => j.id === id)
            setJob(foundJob || null)
            setIsLoading(false)
        }
        fetchJob()
    }, [id])

    const handleReleaseFunds = async () => {
        if (!job || !user) return
        setIsReleasing(true)
        const res = await jobActionsApi.releaseFunds(job.id, user.id)
        setIsReleasing(false)
        if (res.success) {
            toast.success('Funds released! Payment is on its way to the artisan.')
            setJob({ ...job, status: 'completed', releasedAmount: job.totalPrice })
        } else {
            toast.error(res.message || 'Failed to release funds.')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-text-muted font-bold text-sm">Loading job details...</p>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] flex flex-col items-center justify-center p-s3 text-center">
                <h2 className="text-h3 font-bold text-gray-900 mb-2">Job Not Found</h2>
                <p className="text-text-muted mb-6">We couldn't find the job you're looking for.</p>
                <button onClick={() => navigate('/client/jobs')} className="bg-primary text-white px-8 py-3 rounded-full font-bold">
                    Back to Jobs
                </button>
            </div>
        )
    }

    const isActive = job.status === 'active'
    const isCompleted = job.status === 'completed'

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-32">
                {/* Header */}
                <header className="bg-white px-s3 pt-s4 pb-s3 sticky top-0 z-50 border-b border-accent/10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-primary font-bold text-sm mb-4"
                    >
                        <ChevronLeft size={20} />
                        Back to Jobs
                    </button>

                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            {job.artisanAvatar ? (
                                <img
                                    src={job.artisanAvatar}
                                    alt={job.artisanName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary text-h4 font-bold">?</span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-h4 font-bold text-gray-900 leading-tight">{job.title}</h1>
                                <p className="text-b3 text-text-muted font-bold mt-0.5">
                                    {job.artisanName ? `with ${job.artisanName}` : 'Awaiting artisan'}
                                </p>
                            </div>
                        </div>
                        {/* Dispute trigger (only for active jobs) */}
                        {isActive && (
                            <button
                                onClick={() => setShowDispute(true)}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                title="Open dispute"
                            >
                                <MoreVertical size={20} className="text-text-muted" />
                            </button>
                        )}
                    </div>
                </header>

                <div className="px-s3 py-s4 space-y-s4">
                    {/* Status Card */}
                    <div className="bg-white p-s3 rounded-[2rem] shadow-sm border border-accent/10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Current Progress</p>
                                <h2 className="text-h3 font-bold text-gray-900">{job.progress}%</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-h4 font-bold text-primary">₦{job.totalPrice}</p>
                                <p className="text-[10px] text-text-muted font-bold">₦{job.releasedAmount} released</p>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-[#FAF7F2] rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${job.progress}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#3B7A5F] font-bold bg-[#F0F4F2] px-4 py-2 rounded-xl">
                            <ShieldCheck size={14} />
                            Your payment is held securely in escrow
                        </div>
                    </div>

                    {/* Milestones */}
                    {job.milestones.length > 0 && (
                        <div>
                            <h3 className="text-b1 font-bold text-gray-900 mb-4 flex items-center justify-between">
                                Milestones
                                <span className="text-[12px] text-text-muted font-bold">
                                    {job.milestones.filter(m => m.completed).length}/{job.milestones.length}
                                </span>
                            </h3>
                            <div className="space-y-3">
                                {job.milestones.map((milestone, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${milestone.completed
                                            ? 'bg-white border-primary/20 shadow-sm'
                                            : 'bg-white/50 border-accent/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${milestone.completed ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                {milestone.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div>
                                                <p className={`text-b2 font-bold ${milestone.completed ? 'text-gray-900' : 'text-text-muted'}`}>
                                                    {milestone.name}
                                                </p>
                                                <p className="text-[11px] text-text-muted font-medium">
                                                    {milestone.completed ? 'Completed' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tight ${milestone.completed
                                            ? 'bg-primary/5 text-primary'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {milestone.completed ? 'Done' : 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dispute button (visible inline for active jobs) */}
                    {isActive && (
                        <button
                            onClick={() => setShowDispute(true)}
                            className="w-full flex items-center justify-center gap-2 border border-warning/30 bg-orange-50 text-warning rounded-2xl py-3.5 text-sm font-bold hover:bg-orange-100 transition-all active:scale-95"
                        >
                            <AlertTriangle size={16} />
                            Report an Issue / Open Dispute
                        </button>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="fixed bottom-0 left-0 w-full max-w-[500px] bg-white border-t border-accent/10 p-s3 flex gap-3 z-[60]">
                    <button
                        onClick={() => navigate('/client/chat')}
                        className="flex-1 flex items-center justify-center gap-2 border border-accent py-4 rounded-2xl font-bold text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <MessageCircle size={20} />
                        Chat
                    </button>

                    {isCompleted ? (
                        <button className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <Star size={20} />
                            Leave a Review
                        </button>
                    ) : (
                        <button
                            onClick={handleReleaseFunds}
                            disabled={isReleasing || !isActive}
                            className="flex-[2] bg-[#3B7A5F] text-white py-4 rounded-2xl font-bold hover:bg-[#2D5E49] transition-all active:scale-95 shadow-lg shadow-[#3B7A5F]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isReleasing ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>Release Funds <ArrowRight size={20} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Dispute Modal */}
            {showDispute && user && (
                <ModalMobile
                    onClose={() => setShowDispute(false)}
                    direction="bottom"
                    Content={() => (
                        <DisputeModal
                            jobId={job.id}
                            openerId={user.id}
                            onClose={() => setShowDispute(false)}
                        />
                    )}
                />
            )}
        </>
    )
}

export default JobDetails