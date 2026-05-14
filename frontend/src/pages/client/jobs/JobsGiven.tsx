import { useState } from 'react'
import JobCard from '@/lib/components/client/jobs/JobCard'
import { MOCK_CLIENT_JOBS } from '@/lib/utils/mockData'

type JobStatus = 'active' | 'completed' | 'cancelled'

const JobsGiven = () => {
    const [activeTab, setActiveTab] = useState<JobStatus>('active')

    const filteredJobs = MOCK_CLIENT_JOBS.filter(job => job.status === activeTab)

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            {/* Header */}
            <header className="px-s3 pt-s4 pb-s3">
                <h1 className="text-h3 font-bold text-gray-900 mb-6">Your Jobs</h1>

                {/* Tabs */}
                <div className="bg-white p-1.5 rounded-[2rem] shadow-sm border border-accent/5 flex items-center">
                    {(['active', 'completed', 'cancelled'] as JobStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`flex-1 py-3.5 rounded-[1.8rem] text-sm font-bold capitalize transition-all duration-300 ${activeTab === status
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-text-muted hover:text-gray-900'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </header>

            {/* Jobs List */}
            <div className="flex flex-col gap-s3 px-s3">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobCard key={job.id} {...job} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-s4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <h3 className="text-b1 font-bold text-gray-900 mb-1">No {activeTab} jobs</h3>
                        <p className="text-b3 text-text-muted">You don't have any jobs in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobsGiven