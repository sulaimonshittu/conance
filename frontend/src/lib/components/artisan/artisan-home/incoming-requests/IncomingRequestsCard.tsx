import { Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "@/lib/components/common/Button"

export interface IncomingRequest {
    id: string | number
    customerAvatar: string
    customerName: string
    title: string
    distance: string | number
    totalAmount: string | number
    description: string
}

interface IncomingRequestsCardProps {
    request: IncomingRequest
}

const IncomingRequestsCard = ({ request }: IncomingRequestsCardProps) => {
    const navigate = useNavigate()

    const formattedAmount = typeof request.totalAmount === 'number'
        ? `₦${request.totalAmount.toLocaleString()}`
        : request.totalAmount

    return (
        <div className="p-4 bg-white rounded-2xl border border-accent shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-s3">
                <div className="flex items-start gap-3">
                    <img
                        src={request.customerAvatar}
                        alt={request.customerName}
                        className="w-12 h-12 rounded-full object-cover border border-white shadow-sm bg-white"
                    />
                    <div>
                        <h3 className="text-b1 font-bold text-gray-900">
                            {request.title}
                        </h3>
                        <p className="text-b3 text-text-muted mt-0.5">
                            {request.customerName} · {request.distance} km away
                        </p>
                    </div>
                </div>
                <span className="font-serif text-h4 font-bold text-primary">
                    {formattedAmount}
                </span>
            </div>

            <p className="text-b2 text-slate-600 mb-s4 line-clamp-2 leading-relaxed">
                {request.description}
            </p>

            <div className="flex gap-3">
                <Button
                    variant="primary"
                    className="flex-1"
                    leftIcon={<Sparkles size={16} />}
                    onClick={() => navigate(`/artisan/request-job/${request.id}`)}
                >
                    Send Proposal
                </Button>
                <Button variant="outline" className="px-6">
                    Decline
                </Button>
            </div>
        </div>
    )
}

export default IncomingRequestsCard
