import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useChatStore from "@/lib/hooks/useChatStore"
import ChatMenu from "./ChatMenu"

const ChatHeader = () => {
    const navigate = useNavigate()
    const { context } = useChatStore()

    if (!context) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-100'
            case 'completed': return 'text-green-600 bg-green-50 border-green-100'
            case 'terminated': 
            case 'rejected': return 'text-red-600 bg-red-50 border-red-100'
            case 'accepted': return 'text-emerald-600 bg-emerald-50 border-emerald-100'
            default: return 'text-gray-600 bg-gray-50 border-gray-100'
        }
    }

    return (
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-accent/40 px-s3 py-s2 flex items-center justify-between">
            <div className="flex items-center gap-s2">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-gray-600"
                >
                    <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img 
                            src={context.partnerAvatar} 
                            alt={context.partnerName} 
                            className="w-10 h-10 rounded-full object-cover border border-accent/30"
                        />
                        {/* Active Indicator Placeholder */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-b2 font-bold text-gray-900 leading-tight">
                            {context.partnerName}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-text-muted font-medium truncate max-w-[120px]">
                                {context.jobTitle}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getStatusColor(context.status)}`}>
                                {context.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <ChatMenu jobId={context.id} />
        </div>
    )
}

export default ChatHeader
