import { MapPin, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "@/lib/components/common/Button"
import { type DetailedRequest } from "@/lib/utils/mockData"

interface RequestCardProps {
    request: DetailedRequest;
    onDecline?: (id: string | number) => void;
}

export const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
};

const RequestCard = ({ request, onDecline }: RequestCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl p-s3 border border-accent shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-s3">
                <div className="flex items-start gap-s2">
                    <img
                        src={request.customerAvatar}
                        alt={request.customerName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <h3 className="font-serif text-h4 font-bold text-gray-900 mb-s1 leading-tight">
                            {request.title}
                        </h3>
                        <p className="text-text-muted mb-s1 font-medium text-b2">
                            {request.customerName}
                        </p>
                        <div className="flex items-center gap-s1 text-b3 text-text-muted">
                            <div className="flex flex-row items-center gap-s1 text-nowrap">
                                <MapPin size={16} className="text-primary" />
                                <span>{request.distance} km away</span>
                            </div>
                            <span className="text-nowrap">
                                {request.createdAt.toLocaleDateString('en-NG', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-serif text-h3 font-bold text-primary">
                        {formatNaira(request.totalAmount)}
                    </p>
                    <p className="text-b4 text-text-muted font-medium uppercase tracking-wider">Total Est.</p>
                </div>
            </div>

            <div className="mb-s3">
                <h4 className="text-b3 font-bold text-gray-900 mb-s1 uppercase tracking-tight">Description</h4>
                <p className="text-slate-600 text-b2 leading-relaxed">
                    {request.description}
                </p>
            </div>

            <div className="mb-s4">
                <h4 className="text-b3 font-bold text-gray-900 mb-s2 uppercase tracking-tight">
                    Proposed Milestones
                </h4>
                <div className="space-y-s1">
                    {request.proposedMilestones.map((milestone, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-s2 bg-[#FFF3EE] rounded-xl border border-primary/5"
                        >
                            <span className="text-b2 font-medium text-gray-900">
                                {milestone.title}
                            </span>
                            <span className="font-bold text-primary text-b2">
                                {formatNaira(milestone.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-s2">
                <Button
                    variant="primary"
                    fullWidth
                    leftIcon={<Sparkles size={18} />}
                    onClick={() => navigate(`/artisan/request-job/${request.id}`)}
                >
                    Send Proposal
                </Button>
                <Button
                    variant="outline"
                    className="px-s3"
                    onClick={() => onDecline?.(request.id)}
                >
                    Decline
                </Button>
            </div>
        </div>
    )
}

export default RequestCard