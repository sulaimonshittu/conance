import Button from "@/lib/components/common/Button"
import IncomingRequestsCard from "@lib/components/artisan/artisan-home/incoming-requests//IncomingRequestsCard"
import { MOCK_REQUESTS } from "@/lib/utils/mockData";
import { useNavigate } from "react-router-dom";



const IncomingRequests = () => {
    const navigate = useNavigate()
    return (
        <section className="flex flex-col gap-s2 w-full mt-s4 mb-24">
            <div className="flex justify-between items-center mb-s2">
                <h1 className="font-bold text-h2 text-gray-900">
                    Incoming Requests
                </h1>
                <Button variant="ghost" className="text-primary text-b2 hover:bg-transparent" onClick={() => navigate('/artisan/requests')}>View All</Button>
            </div>

            <div className="flex flex-col gap-4">
                {MOCK_REQUESTS.slice(0, 4).map((request) => (
                    <IncomingRequestsCard key={request.id} request={request} />
                ))}
            </div>
        </section>
    )
}

export default IncomingRequests