import type { DetailedRequest } from "@/lib/utils/mockData"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"

interface JobRequestDetailsProps {
    request: DetailedRequest
}

const JobRequestDetails = ({ request }: JobRequestDetailsProps) => {
    return (
        <div className="flex flex-col gap-s3">
            {/* Header: Customer Info */}
            <div className="flex items-center gap-s2">
                <img 
                    src={request.customerAvatar} 
                    alt={request.customerName} 
                    className="w-14 h-14 rounded-full object-cover border border-accent shadow-sm"
                />
                <div>
                    <h2 className="text-h4 font-bold text-gray-900 leading-tight">
                        {request.customerName}
                    </h2>
                    <p className="text-b3 text-text-muted font-medium">
                        {request.distance} km away
                    </p>
                </div>
            </div>

            {/* Job Title */}
            <h1 className="text-h3 font-extrabold text-gray-900 leading-tight font-serif mt-s1">
                {request.title}
            </h1>

            {/* Description */}
            <p className="text-b2 text-gray-700 leading-relaxed font-medium">
                {request.description}
            </p>

            {/* Milestones Card */}
            <div className="bg-[#FAF7F2] p-s3 rounded-3xl border border-[#F1E9DA] mt-s2">
                <h3 className="text-b2 font-bold text-gray-900 mb-s3">
                    Customer's Proposed Milestones
                </h3>
                
                <div className="space-y-s2 mb-s3">
                    {request.proposedMilestones.map((milestone, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <span className="text-b3 text-text-muted font-medium">
                                {milestone.title}
                            </span>
                            <span className="text-b2 font-bold text-gray-900">
                                {formatNaira(milestone.amount)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-s3 border-t border-accent/30 flex justify-between items-center">
                    <span className="text-b2 font-bold text-gray-900 uppercase tracking-tight">
                        Total Budget
                    </span>
                    <span className="text-h4 font-extrabold text-primary">
                        {formatNaira(request.totalAmount)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default JobRequestDetails