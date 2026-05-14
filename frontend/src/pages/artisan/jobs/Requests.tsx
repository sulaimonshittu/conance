import { useState, useEffect } from "react"
import Requests from "@lib/components/artisan/artisan-requests/Requests"
import PendingRequests from "@lib/components/artisan/artisan-requests/PendingRequests"
import useArtisanStore from "@/lib/hooks/useArtisanStore"

const RequestsPage = () => {
    const [activeTab, setActiveTab] = useState<"search" | "pending">("search")
    const { pendingProposals, fetchPendingProposals } = useArtisanStore()

    useEffect(() => {
        fetchPendingProposals()
    }, [])

    return (
        <section className="pb-s5">
            {/* Header */}
            <div className="flex flex-col items-center gap-s1 mb-s4 px-s4 pt-s3">
                <h1 className="font-bold text-h2 text-gray-900">
                    Job Requests
                </h1>
                <p className="text-b3 text-text-muted text-center max-w-[300px]">
                    Manage your proposals and discover new opportunities
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex px-s3 mb-s4 border-b border-accent/20">
                <button 
                    onClick={() => setActiveTab("search")}
                    className={`flex-1 pb-3 text-b3 font-bold transition-all relative ${
                        activeTab === "search" ? "text-primary" : "text-text-muted hover:text-gray-900"
                    }`}
                >
                    Job Search
                    {activeTab === "search" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("pending")}
                    className={`flex-1 pb-3 text-b3 font-bold transition-all relative flex items-center justify-center gap-2 ${
                        activeTab === "pending" ? "text-primary" : "text-text-muted hover:text-gray-900"
                    }`}
                >
                    Pending Jobs
                    {pendingProposals.length > 0 && (
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] text-white font-bold animate-in zoom-in duration-300 ${
                            activeTab === "pending" ? "bg-primary" : "bg-text-muted"
                        }`}>
                            {pendingProposals.length}
                        </span>
                    )}
                    {activeTab === "pending" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === "search" ? (
                    <Requests />
                ) : (
                    <PendingRequests />
                )}
            </div>
        </section>
    )
}

export default RequestsPage