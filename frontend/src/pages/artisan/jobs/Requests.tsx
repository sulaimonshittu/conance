import { useState, useEffect } from "react"
import Requests from "@lib/components/artisan/artisan-requests/Requests"
import PendingRequests from "@lib/components/artisan/artisan-requests/PendingRequests"
import ArtisanRecommendedJobs from "./ArtisanRecommendedJobs"
import useArtisanStore from "@/lib/hooks/useArtisanStore"
import { Sparkles } from "lucide-react"

type Tab = "recommended" | "search" | "pending"

const RequestsPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("recommended")
    const { pendingProposals, fetchPendingProposals } = useArtisanStore()

    useEffect(() => {
        fetchPendingProposals()
    }, [])

    const tabs: { id: Tab; label: string; badge?: number; icon?: React.ReactNode }[] = [
        { id: "recommended", label: "For You", icon: <Sparkles size={13} /> },
        { id: "search", label: "Browse" },
        { id: "pending", label: "My Proposals", badge: pendingProposals.length },
    ]

    return (
        <section className="pb-s5">
            {/* Header */}
            <div className="flex flex-col items-center gap-s1 mb-s3 px-s4 pt-s3">
                <h1 className="font-bold text-h2 text-gray-900">Job Requests</h1>
                <p className="text-b3 text-text-muted text-center max-w-[300px]">
                    Discover opportunities and manage your proposals
                </p>
            </div>

            {/* Tabs */}
            <div className="flex px-s3 mb-s4 border-b border-accent/20 gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map(({ id, label, badge, icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex-shrink-0 pb-3 px-2 text-b3 font-bold transition-all relative flex items-center gap-1.5 ${activeTab === id ? "text-primary" : "text-text-muted hover:text-gray-900"
                            }`}
                    >
                        {icon}
                        {label}
                        {badge !== undefined && badge > 0 && (
                            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] text-white font-bold ${activeTab === id ? "bg-primary" : "bg-text-muted"
                                }`}>
                                {badge}
                            </span>
                        )}
                        {activeTab === id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-200">
                {activeTab === "recommended" && <ArtisanRecommendedJobs />}
                {activeTab === "search" && <Requests />}
                {activeTab === "pending" && <PendingRequests />}
            </div>
        </section>
    )
}

export default RequestsPage