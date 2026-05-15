import React from "react"
import { formatNaira } from "../artisan-requests/RequestCard"
import { Calendar, Trash2, Loader2 } from "lucide-react"

interface PendingRequestCardProps {
    request: {
        id: string | number
        customerAvatar: string
        customerName: string
        title: string
        date: string
        status: "pending" | "accepted" | "rejected"
        totalAmount: number
    }
    onCancel?: (id: string | number) => void
    isCancelling?: boolean
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({ request, onCancel, isCancelling }) => {
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-100"
            case "accepted": return "bg-green-50 text-green-700 border-green-100"
            case "rejected": return "bg-red-50 text-red-700 border-red-100"
            default: return "bg-gray-50 text-gray-700 border-gray-100"
        }
    }

    return (
        <div className="bg-white p-s3 rounded-3xl border border-accent/30 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-s2">
                <div className="flex items-center gap-s2">
                    <img 
                        src={request.customerAvatar} 
                        alt={request.customerName} 
                        className="w-10 h-10 rounded-full object-cover border border-accent/20"
                    />
                    <div>
                        <h3 className="text-b3 font-bold text-gray-900 leading-tight">
                            {request.customerName}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                            <Calendar size={10} />
                            <span>{request.date}</span>
                        </div>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(request.status)}`}>
                    {request.status}
                </div>
            </div>

            <div className="mb-s3">
                <h2 className="text-b2 font-bold text-gray-900 leading-tight mb-1">
                    {request.title}
                </h2>
                <p className="text-b1 font-extrabold text-primary">
                    {formatNaira(request.totalAmount)}
                </p>
            </div>

            <div className="pt-s2 border-t border-accent/20 flex justify-end">
                <button 
                    onClick={() => onCancel?.(request.id)}
                    disabled={isCancelling}
                    className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-b3 font-bold disabled:opacity-50"
                >
                    {isCancelling ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                    <span>Cancel Proposal</span>
                </button>
            </div>
        </div>
    )
}

export default PendingRequestCard