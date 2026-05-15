import { type JobContext } from "@/lib/api/chat.api"
import { useNavigate } from "react-router-dom"
import { Lock } from "lucide-react"

interface ChatConversationItemProps {
    conversation: JobContext
}

const ChatConversationItem = ({ conversation }: ChatConversationItemProps) => {
    const navigate = useNavigate()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-100'
            case 'completed': return 'text-gray-600 bg-gray-100 border-gray-200'
            case 'terminated':
            case 'rejected': return 'text-red-600 bg-red-50 border-red-100'
            case 'accepted':
            case 'reopened': return 'text-emerald-600 bg-emerald-50 border-emerald-100'
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-100'
        }
    }

    const isReadOnly = conversation.status === 'completed' || conversation.status === 'terminated' || conversation.status === 'archived'

    return (
        <button
            onClick={() => navigate(`?jobId=${conversation.id}`)}
            className="w-full text-left p-s3 border-b border-accent/20 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between group active:bg-[#F1E9DA]"
        >
            <div className="flex items-center gap-s3 flex-1 min-w-0">
                <div className="relative shrink-0">
                    <img
                        src={conversation.partnerAvatar}
                        alt={conversation.partnerName}
                        className={`w-12 h-12 rounded-full object-cover border border-accent/30 ${isReadOnly ? 'grayscale opacity-70' : ''}`}
                    />
                    {/* Active/Status indicator */}
                    {!isReadOnly && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-b2 font-bold text-gray-900 truncate pr-2 group-hover:text-[#0D3D34] transition-colors">
                            {conversation.partnerName}
                        </h3>
                        {/* Mock timestamp */}
                        <span className="text-[10px] text-gray-400 font-medium shrink-0 pt-0.5">
                            2m ago
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <p className="text-b3 text-text-muted truncate">
                            {isReadOnly ? (
                                <span className="flex items-center gap-1 text-gray-400 italic">
                                    <Lock size={12} /> Chat locked
                                </span>
                            ) : (
                                "Tap to view conversation..."
                            )}
                        </p>

                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    )
}

export default ChatConversationItem
