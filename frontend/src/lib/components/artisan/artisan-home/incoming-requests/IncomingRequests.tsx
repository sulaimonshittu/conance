import Button from "@/lib/components/common/Button"
import IncomingRequestsCard from "@lib/components/artisan/artisan-home/incoming-requests//IncomingRequestsCard"
import { useNavigate } from "react-router-dom";
import { useArtisan } from "@/lib/hooks/useArtisan";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const IncomingRequests = () => {
    const navigate = useNavigate()
    const { requests, isLoading, fetchRequests } = useArtisan()

    useEffect(() => {
        // Fetch requests if not already loaded
        if (requests.length === 0) {
            fetchRequests()
        }
    }, [fetchRequests, requests.length])

    return (
        <section className="flex flex-col gap-s2 w-full mt-s2 mb-s2">
            <div className="flex justify-between items-center mb-s2">
                <h1 className="font-bold text-h2 text-gray-900">
                    Incoming Requests
                </h1>
                <Button
                    variant="ghost"
                    className="text-primary text-b2 hover:bg-transparent"
                    onClick={() => navigate('/artisan/requests')}
                >
                    View All
                </Button>
            </div>

            {isLoading && requests.length === 0 ? (
                <div className="flex justify-center py-s5">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-s5 bg-slate-50 rounded-2xl border border-dashed border-accent">
                    <p className="text-b3 text-text-muted">No incoming requests at the moment.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.slice(0, 2).map((request) => (
                        <IncomingRequestsCard key={request.id} request={request} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default IncomingRequests