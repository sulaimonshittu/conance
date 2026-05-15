import { useState } from 'react'
import JobCard from '@/lib/components/client/jobs/JobCard'
import OpenJobCard from '@/lib/components/client/jobs/OpenJobCard'
import { MOCK_CLIENT_JOBS } from '@/lib/utils/mockData'

type JobStatus = 'open' | 'active' | 'completed' | 'cancelled'

const TABS: { id: JobStatus; label: string }[] = [
    { id: 'open', label: 'Open' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
]

const EMPTY_MESSAGES: Record<JobStatus, { icon: string; title: string; subtitle: string }> = {
    open: { icon: '📬', title: 'No open jobs', subtitle: 'Jobs you post will appear here while waiting for artisans to apply.' },
    active: { icon: '🔧', title: 'No active jobs', subtitle: 'Hire an artisan from an open job to get started.' },
    completed: { icon: '✅', title: 'No completed jobs', subtitle: 'Finished jobs will be shown here.' },
    cancelled: { icon: '🚫', title: 'No cancelled jobs', subtitle: "Cancelled jobs will appear here." },
}

const JobsGiven = () => {
    const [activeTab, setActiveTab] = useState<JobStatus>('open')

    const filteredJobs = MOCK_CLIENT_JOBS.filter(job => job.status === activeTab)
    const empty = EMPTY_MESSAGES[activeTab]


    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            {/* Header */}
            <header className="px-s1 pt-s4 pb-s3">
                <h1 className="text-h3 font-bold text-gray-900 mb-6">Your Jobs</h1>

                {/* Tabs — Capsule Design */}
                <div className="flex bg-primary/10 p-s1 overflow-x-scroll rounded-[20px] w-full">
                    {TABS.map(({ id, label }) => {
                        const count = MOCK_CLIENT_JOBS.filter(j => j.status === id).length;
                        // Map labels to match image-style naming
                        const displayLabel = id === 'active' ? 'Scheduled' : id === 'cancelled' ? 'Failed' : label;

                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[16px] text-[13px] font-bold transition-all duration-300 ${activeTab === id
                                    ? 'bg-primary2 text-white shadow-sm'
                                    : 'text-text-muted hover:text-gray-900'
                                    }`}
                            >
                                <span className="capitalize">{displayLabel}</span>
                                <span className="opacity-80">({count})</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* Jobs List */}
            <div className="flex flex-col gap-s3 px-s3">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) =>
                        job.status === 'open' ? (
                            <OpenJobCard key={job.id} job={job} />
                        ) : (
                            <JobCard key={job.id} {...job} />
                        )
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-s4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">{empty.icon}</span>
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