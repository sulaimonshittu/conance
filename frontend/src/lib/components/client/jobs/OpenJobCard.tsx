import { useState } from 'react'
import { Users, Clock, Star, ChevronRight, X, MessageCircle, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ClientJob, Proposal } from '@/lib/utils/mockData'
import ModalMobile from '@/lib/components/common/modals/ModalMobile'

// ─── Proposal Modal Content ─────────────────────────────────────

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const navigate = useNavigate()
    return (
        <div className="bg-white border border-accent/10 rounded-3xl p-4 flex flex-col gap-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <img
                            src={proposal.artisanAvatar}
                            alt={proposal.artisanName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                    </div>
                    <div>
                        <h4 className="text-b2 font-bold text-gray-900">{proposal.artisanName}</h4>
                        <p className="text-[12px] text-text-muted font-medium">{proposal.artisanTitle}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[12px] font-bold text-gray-700">
                                {proposal.rating} · {proposal.reviewCount} reviews
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-b2 font-bold text-primary">₦{proposal.price}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={11} className="text-text-muted" />
                        <span className="text-[11px] text-text-muted font-medium">{proposal.duration}</span>
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="bg-[#FAF7F2] px-4 py-3 rounded-2xl">
                <p className="text-[13px] text-gray-700 leading-relaxed">{proposal.message}</p>
            </div>

            {/* Timestamp & Actions */}
            <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted font-medium">{proposal.submittedAt}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/client/chat?id=${proposal.artisanId}`)}
                        className="flex items-center gap-1.5 border border-accent px-4 py-2 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <MessageCircle size={15} />
                        Chat
                    </button>
                    <button
                        onClick={() => navigate(`/client/artisan-details/${proposal.artisanId}`)}
                        className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-primary2 transition-all active:scale-95 shadow-sm shadow-primary/20"
                    >
                        <Check size={15} />
                        Hire
                    </button>
                </div>
            </div>
        </div>
    )
}

const ProposalsDrawerContent = ({ job, onClose }: { job: ClientJob; onClose: () => void }) => (
    <div className="p-s3 flex flex-col gap-s3 bg-white rounded-t-3xl h-full">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-b1 font-bold text-gray-900">Proposals</h3>
                <p className="text-[12px] text-text-muted font-medium">{job.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-text-muted" />
            </button>
        </div>

        {job.proposals && job.proposals.length > 0 ? (
            <div className="flex flex-col gap-s3">
                {job.proposals.map(p => (
                    <ProposalCard key={p.id} proposal={p} />
                ))}
            </div>
        ) : (
            <div className="py-10 text-center">
                <p className="text-b2 font-bold text-gray-900">No proposals yet</p>
                <p className="text-[13px] text-text-muted mt-1">Artisans will start sending proposals soon.</p>
            </div>
        )}
    </div>
)

// ─── Open Job Card ──────────────────────────────────────────────

interface OpenJobCardProps {
    job: ClientJob
}

const OpenJobCard = ({ job }: OpenJobCardProps) => {
    const [showProposals, setShowProposals] = useState(false)

    return (
        <>
            <div className="bg-white  p-s3 rounded-[2.5rem] shadow-sm border border-accent/10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full self-start">
                            Open · Awaiting hire
                        </span>
                        <h3 className="text-h4 font-bold text-gray-900 mt-2 leading-tight">{job.title}</h3>
                        <p className="text-[12px] text-text-muted font-medium">Posted {job.date}</p>
                    </div>
                </div>

                {/* Proposals Count CTA */}
                <button
                    onClick={() => setShowProposals(true)}
                    className="flex items-center justify-between w-full bg-[#FAF7F2] hover:bg-[#F5F0E8] px-5 py-4 rounded-2xl border border-accent/10 transition-all active:scale-[0.99] group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Users size={20} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-b2 font-bold text-gray-900">
                                {job.proposalCount ?? 0} Proposal{(job.proposalCount ?? 0) !== 1 ? 's' : ''} received
                            </p>
                            <p className="text-[11px] text-text-muted font-medium">Tap to review and hire</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                </button>
            </div>

            {/* Proposals Modal */}
            {showProposals && (
                <ModalMobile
                    onClose={() => setShowProposals(false)}
                    Content={({ onClose }: { onClose: () => void }) => (
                        <ProposalsDrawerContent job={job} onClose={onClose} />
                    )}
                    direction="bottom"
                />
            )}
        </>
    )
}

export default OpenJobCard
