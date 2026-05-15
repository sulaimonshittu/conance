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

    // Count open jobs for badge
    const openCount = MOCK_CLIENT_JOBS.filter(j => j.status === 'open').length

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            {/* Header */}
            <header className="px-s3 pt-s4 pb-s3">
                <h1 className="text-h3 font-bold text-gray-900 mb-6">Your Jobs</h1>

                {/* Tabs — horizontal scroll for 4 tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {TABS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`relative flex-shrink-0 px-5 py-3 rounded-2xl text-sm font-bold capitalize transition-all duration-300 ${activeTab === id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white text-text-muted border border-accent/20 hover:text-gray-900'
                                }`}
                        >
                            {label}
                            {/* Badge for open count */}
                            {id === 'open' && openCount > 0 && (
                                <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white ${activeTab === 'open' ? 'bg-white text-primary' : 'bg-primary text-white'
                                    }`}>
                                    {openCount}
                                </span>
                            )}
                        </button>
                    ))}
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