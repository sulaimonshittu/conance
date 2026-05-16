import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import JobCard from '@/lib/components/client/jobs/JobCard'
import OpenJobCard from '@/lib/components/client/jobs/OpenJobCard'
import { jobApi } from '@/lib/api/job.api'
import { useAuth } from '@/lib/hooks/useAuth'

// Backend status values aligned with API.md
type JobStatus = 'pending' | 'open' | 'active' | 'completed' | 'cancelled'

const TABS: { id: JobStatus; label: string; emoji: string }[] = [
    { id: 'pending', label: 'Pending', emoji: '⏳' },
    { id: 'open', label: 'Open', emoji: '📬' },
    { id: 'active', label: 'Active', emoji: '🔧' },
    { id: 'completed', label: 'Done', emoji: '✅' },
    { id: 'cancelled', label: 'Cancelled', emoji: '🚫' },
]

const EMPTY_MESSAGES: Record<JobStatus, { icon: string; title: string; subtitle: string }> = {
    pending: {
        icon: '⏳',
        title: 'No pending jobs',
        subtitle: 'Jobs you just posted will appear here while the backend processes them.',
    },
    open: {
        icon: '📬',
        title: 'No open jobs',
        subtitle: 'Jobs waiting for artisan proposals will appear here.',
    },
    active: {
        icon: '🔧',
        title: 'No active jobs',
        subtitle: 'Hire an artisan from an open job to get started.',
    },
    completed: {
        icon: '✅',
        title: 'No completed jobs',
        subtitle: 'Finished jobs will be shown here.',
    },
    cancelled: {
        icon: '🚫',
        title: 'No cancelled jobs',
        subtitle: 'Cancelled jobs will appear here.',
    },
}

const JobsGiven = () => {
    const [activeTab, setActiveTab] = useState<JobStatus>('pending')
    const [jobs, setJobs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        const fetchJobs = async () => {
            if (!user?.id) return
            setIsLoading(true)
            const res = await jobApi.getClientJobs(user.id)
            if (res.success && res.data) {
                setJobs(res.data)
            }
            setIsLoading(false)
        }
        fetchJobs()
    }, [user?.id])

    const filteredJobs = jobs.filter((job) => job.status === activeTab)
    const empty = EMPTY_MESSAGES[activeTab]

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            {/* Header */}
            <header className="px-s3 pt-s4 pb-s3">
                <h1 className="text-h3 font-bold text-gray-900 mb-6">Your Jobs</h1>

                {/* Tabs — Scrollable capsule design */}
                <div className="flex bg-primary/10 p-s1 gap-1 overflow-x-auto rounded-[20px] w-full scrollbar-hide">
                    {TABS.map(({ id, label }) => {
                        const count = jobs.filter((j) => j.status === id).length
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-shrink-0 flex items-center justify-center gap-1 px-3 py-2.5 rounded-[14px] text-[12px] font-bold transition-all duration-200 ${activeTab === id
                                        ? 'bg-primary2 text-white shadow-sm'
                                        : 'text-text-muted hover:text-gray-900'
                                    }`}
                            >
                                <span>{label}</span>
                                {count > 0 && (
                                    <span
                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* Jobs List */}
            <div className="flex flex-col gap-s3 px-s3">
                {isLoading ? (
                    <div className="flex justify-center py-s5">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job) =>
                        (job.status as any) === 'open' || (job.status as any) === 'pending' ? (
                            <OpenJobCard key={job.id} job={job} />
                        ) : (
                            <JobCard key={job.id} {...job} />
                        )
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-s4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">{empty.icon}</span>
                        </div>
                        <h3 className="text-b1 font-bold text-gray-900 mb-1">{empty.title}</h3>
                        <p className="text-b3 text-text-muted max-w-[260px]">{empty.subtitle}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobsGiven