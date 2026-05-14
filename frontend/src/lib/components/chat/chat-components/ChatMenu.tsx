import { useState } from "react"
import { MoreVertical, Ban, CheckCircle2, Wallet, X } from "lucide-react"
import useAuthStore from "@/lib/hooks/useAuthStore"
import useChatStore from "@/lib/hooks/useChatStore"
import Button from "@/lib/components/common/Button"

interface ChatMenuProps {
    jobId: string
}

const ChatMenu = ({ jobId }: ChatMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const { role } = useAuthStore()
    const { startJob, terminateJob, rejectJob, sendMaterialPayment, reopenChat, context } = useChatStore()
    const [isLoading, setIsLoading] = useState(false)

    // Modals state
    const [showConfirm, setShowConfirm] = useState<{ type: string; title: string; message: string } | null>(null)

    const handleAction = async (type: string) => {
        setIsLoading(true)
        if (type === "start") await startJob(jobId)
        if (type === "terminate") await terminateJob(jobId, "Terminated by artisan")
        if (type === "reject") await rejectJob(jobId, "Rejected by artisan")
        if (type === "pay") await sendMaterialPayment(jobId, 15000) // Mock amount
        if (type === "reopen") await reopenChat(jobId)
        setIsLoading(false)
        setShowConfirm(null)
        setIsOpen(false)
    }

    const openConfirm = (type: string, title: string, message: string) => {
        setShowConfirm({ type, title, message })
        setIsOpen(false)
    }

    if (!context || context.status === "terminated" || context.status === "rejected") return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-gray-600"
            >
                <MoreVertical size={20} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-accent/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {role === "artisan" && (
                            <>
                                {(context.status === "in-progress" || context.status === "reopened") && (
                                    <button 
                                        onClick={() => openConfirm("terminate", "Terminate Job?", "Are you sure you want to end this active job? This will be recorded on your profile.")}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                                    >
                                        <Ban size={16} /> Terminate Job
                                    </button>
                                )}
                                {context.status === "accepted" && (
                                    <button 
                                        onClick={() => openConfirm("reject", "Reject Job?", "Are you sure you want to reject this job offer?")}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                                    >
                                        <Ban size={16} /> Reject Job
                                    </button>
                                )}
                            </>
                        )}

                        {role === "client" && (
                            <>
                                {context.status === "accepted" && (
                                    <button 
                                        onClick={() => openConfirm("start", "Start Job?", "Are you ready to officially start this job?")}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition-colors font-medium text-left border-b border-accent/30"
                                    >
                                        <CheckCircle2 size={16} className="text-success" /> Start Job
                                    </button>
                                )}
                                {(context.status === "in-progress" || context.status === "accepted" || context.status === "reopened") && (
                                    <button 
                                        onClick={() => openConfirm("pay", "Send Materials Payment?", "Do you want to release funds for materials now?")}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 transition-colors font-medium text-left"
                                    >
                                        <Wallet size={16} className="text-primary" /> Send Material Funds
                                    </button>
                                )}
                                {(context.status === "completed" || context.status === "archived") && (
                                    <button 
                                        onClick={() => openConfirm("reopen", "Reopen Conversation?", "Do you want to re-enable messaging for this completed job to follow up with the artisan?")}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0D3D34] hover:bg-[#FAF7F2] transition-colors font-medium text-left border-t border-accent/30"
                                    >
                                        <CheckCircle2 size={16} /> Reopen Conversation
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-s4 bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-s4 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowConfirm(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-h4 font-bold text-gray-900 mb-2">{showConfirm.title}</h3>
                        <p className="text-b2 text-text-muted mb-s4">{showConfirm.message}</p>
                        <div className="flex gap-s2">
                            <Button 
                                variant="outline" 
                                className="flex-1 rounded-xl"
                                onClick={() => setShowConfirm(null)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant={showConfirm.type === 'terminate' || showConfirm.type === 'reject' ? 'danger' : 'primary'}
                                className={`flex-1 rounded-xl ${showConfirm.type === 'pay' || showConfirm.type === 'start' ? 'bg-[#0D3D34] hover:bg-[#092D26]' : ''}`}
                                onClick={() => handleAction(showConfirm.type)}
                                isLoading={isLoading}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatMenu
