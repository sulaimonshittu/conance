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
    ArrowRight
} from 'lucide-react'

const JobDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [job, setJob] = useState<ClientJob | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        const fetchJob = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 800))
            const foundJob = MOCK_CLIENT_JOBS.find(j => j.id === id)
            setJob(foundJob || null)
            setIsLoading(false)
        }
        fetchJob()
    }, [id])

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

    return (
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
                        <img 
                            src={job.artisanAvatar} 
                            alt={job.artisanName} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div>
                            <h1 className="text-h4 font-bold text-gray-900 leading-tight">
                                {job.title}
                            </h1>
                            <p className="text-b3 text-text-muted font-bold mt-0.5">
                                with {job.artisanName}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={20} className="text-text-muted" />
                    </button>
                </div>
            </header>

            <div className="px-s3 py-s4 space-y-s5">
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
                                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                                    milestone.completed 
                                    ? 'bg-white border-primary/20 shadow-sm' 
                                    : 'bg-white/50 border-accent/10 grayscale-[0.5]'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${
                                        milestone.completed ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {milestone.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                    </div>
                                    <div>
                                        <p className={`text-b2 font-bold ${milestone.completed ? 'text-gray-900' : 'text-text-muted'}`}>
                                            {milestone.name}
                                        </p>
                                        <p className="text-[11px] text-text-muted font-medium">
                                            {milestone.completed ? 'Completed on May 12' : 'Not yet started'}
                                        </p>
                                    </div>
                                </div>
                                {milestone.completed ? (
                                    <span className="text-[10px] bg-primary/5 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-tight">
                                        Released
                                    </span>
                                ) : (
                                    <button className="text-[10px] text-primary font-bold hover:underline">
                                        Details
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-s3 rounded-[2rem] shadow-sm border border-accent/10">
                    <h3 className="text-b1 font-bold text-gray-900 mb-4">Activity Timeline</h3>
                    <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm" />
                            <p className="text-b3 font-bold text-gray-900">Material Sourcing Completed</p>
                            <p className="text-[11px] text-text-muted font-medium">Yesterday, 4:30 PM</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1 w-4 h-4 bg-gray-200 rounded-full border-2 border-white shadow-sm" />
                            <p className="text-b3 font-bold text-gray-500">Framework Construction Started</p>
                            <p className="text-[11px] text-text-muted font-medium">Today, 9:00 AM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 w-full max-w-[400px] bg-white border-t border-accent/10 p-s3 flex gap-3 z-[60]">
                <button 
                    onClick={() => navigate('/client/chat')}
                    className="flex-1 flex items-center justify-center gap-2 border border-accent py-4 rounded-2xl font-bold text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
                >
                    <MessageCircle size={20} />
                    Chat
                </button>
                {job.status === 'completed' ? (
                    <button className="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <Star size={20} />
                        Leave a Review
                    </button>
                ) : (
                    <button className="flex-[2] bg-[#3B7A5F] text-white py-4 rounded-2xl font-bold hover:bg-[#2D5E49] transition-all active:scale-95 shadow-lg shadow-[#3B7A5F]/20 flex items-center justify-center gap-2">
                        Release Milestone
                        <ArrowRight size={20} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default JobDetails