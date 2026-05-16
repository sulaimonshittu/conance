import React, { useEffect, useState } from "react"
import { artisanApi } from "@/lib/api/artisan.api"
import { Sparkles, Edit3, Send, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Button from "@/lib/components/common/Button"
import { useAuth } from "@/lib/hooks/useAuth"

interface GenerateProposalProps {
    id: string | number
}

const GenerateProposal: React.FC<GenerateProposalProps> = ({ id }) => {
    const [proposal, setProposal] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [price, setPrice] = useState<number | "">("")
    const [eta, setEta] = useState<number | "">("")

    const { user } = useAuth()

    useEffect(() => {
        const fetchProposal = async () => {
            setIsLoading(true)
            // 1. Get job details for context
            const jobRes = await artisanApi.getProjectById(id)
            const jobData = jobRes.data as any
            
            // 2. Draft proposal via API
            const res = await artisanApi.draftProposal(
                jobData?.title || "Job Request",
                jobData?.description || "",
                user?.bio || ""
            )


            if (res.success && res.data) {
                setProposal(res.data)
            }
            setIsLoading(false)
        }
        fetchProposal()
    }, [id, user?.bio])




    const handleSend = async () => {
        if (!user?.id) {
            toast.error("You must be logged in as an artisan to send a proposal.")
            return
        }
        if (!price || !eta) {
            toast.error("Please provide both price and ETA.")
            return
        }

        setIsSending(true)
        try {
            const payload = {
                artisanId: user.id,
                priceKobo: Number(price) * 100, // Convert Naira to Kobo
                etaMinutes: Number(eta),
                message: proposal
            }
            const res = await artisanApi.sendProposal(id, payload)
            if (res.success) {
                toast.success(res.message || "Proposal sent successfully!", {
                    icon: <CheckCircle2 className="text-success" size={18} />
                })
            } else {
                toast.error(res.message || "Failed to send proposal")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center gap-s2 py-s5 bg-[#FAF7F2] rounded-3xl border border-dashed border-accent/50">
                <Loader2 className="w-8 h-8 text-[#0D3D34] animate-spin" />
                <p className="text-b3 text-text-muted font-bold uppercase tracking-wider">Generating Proposal...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-s4">
            {/* AI Header */}
            <div className="flex items-start gap-s2">
                <div className="bg-[#E9F2F0] p-s2 rounded-xl text-[#0D3D34] shadow-sm">
                    <Sparkles size={22} />
                </div>
                <div>
                    <h3 className="text-b1 font-bold text-[#0D3D34] leading-none">
                        AI-Generated Proposal
                    </h3>
                    <p className="text-b3 text-text-muted font-medium mt-1.5">
                        Ready to send
                    </p>
                </div>
            </div>

            {/* Proposal Details (Price & ETA) */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₦)</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="e.g. 50000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-4 py-3 rounded-2xl border border-accent bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">ETA (Minutes)</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="e.g. 120"
                        value={eta}
                        onChange={(e) => setEta(e.target.value ? Number(e.target.value) : "")}
                        className="w-full px-4 py-3 rounded-2xl border border-accent bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Proposal Text Area Container */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full min-h-[240px] p-s4 rounded-3xl border transition-all duration-300 resize-none font-medium text-b2 leading-relaxed focus:outline-none focus:ring-4 focus:ring-[#0D3D34]/5 ${isEditing
                        ? 'bg-white border-[#0D3D34] shadow-md'
                        : 'bg-[#FAF7F2] border-[#F1E9DA] cursor-default'
                        }`}
                />
                {!isEditing && (
                    <div className="absolute top-4 right-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 size={16} />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-s3 mb-s4">
                <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex-1 rounded-full border-2 font-bold py-3.5 !border-[#0D3D34] ${isEditing
                        ? 'bg-[#0D3D34] text-white shadow-lg'
                        : 'text-[#0D3D34] hover:bg-[#E9F2F0]'
                        }`}
                    leftIcon={<Edit3 size={18} />}
                >
                    {isEditing ? "Save" : "Edit"}
                </Button>

                <Button
                    onClick={handleSend}
                    isLoading={isSending}
                    loadingText="Sending..."
                    className="flex-[1.5] rounded-full py-4 bg-[#0D3D34] hover:bg-[#092D26] !text-white shadow-xl shadow-[#0D3D34]/20 active:scale-95 border-none"
                    leftIcon={!isSending ? <Send size={18} /> : undefined}
                >
                    {!isSending && "Send proposal"}
                </Button>
            </div>
        </div>
    )
}

export default GenerateProposal
