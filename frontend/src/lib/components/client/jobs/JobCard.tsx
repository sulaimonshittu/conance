import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ClientJob } from '@/lib/utils/mockData'
import FundJobModal, { type VirtualAccountInfo } from '@/lib/components/client/job-posting/JobFundingPanel'
import ModalMobile from '@/lib/components/common/modals/ModalMobile'
import { toast } from 'sonner'

interface JobCardProps extends ClientJob { }

const JobCard: React.FC<JobCardProps> = ({
    id,
    title,
    artisanName,
    artisanAvatar,
    totalPrice,
    releasedAmount,
    progress,
    squadVirtualAccount
}) => {
    const navigate = useNavigate()
    const [showFundingModal, setShowFundingModal] = useState(false)

    const handleConfirmFunding = () => {
        toast.success("Transfer confirmed! We will notify you once received.")
        setShowFundingModal(false)
    }

    const virtualAccount: VirtualAccountInfo = squadVirtualAccount ? {
        bankName: "Squad Virtual Bank",
        accountNumber: squadVirtualAccount,
        accountName: "Conance Job Wallet"
    } : {
        bankName: "Squad Virtual Bank",
        accountNumber: "0123456789",
        accountName: "CONANCE-JOB-WALLET",
    }

    return (
        <>
            <div
                onClick={() => navigate(`/client/job-details/${id}`)}
                className="bg-white p-s3 rounded-[2.5rem] shadow-sm border border-accent/10 flex flex-col gap-6 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
            >
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <img
                            src={artisanAvatar}
                            alt={artisanName}
                            className="w-16 h-16 rounded-full object-cover shadow-sm"
                        />
                        <div className="flex flex-col gap-1 max-w-[140px]">
                            <h3 className="text-h4 font-bold text-gray-900 leading-[1.1] tracking-tight">
                                {title}
                            </h3>
                            <p className="text-[13px] text-text-muted font-medium">
                                with {artisanName}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[22px] font-bold text-primary leading-none">
                            ₦{totalPrice}
                        </div>
                        <div className="mt-1 flex flex-col">
                            <span className="text-[12px] text-text-muted font-bold">₦{releasedAmount}</span>
                            <span className="text-[10px] text-text-muted/60 font-bold uppercase tracking-wider">released</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-b3 text-text-muted font-bold">Progress</span>
                        <span className="text-b2 font-bold text-gray-900">{progress}%</span>
                    </div>

                    {/* Main Progress Bar */}
                    <div className="h-2.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Milestone Indicators (Visual only as per design) */}
                    <div className="flex gap-2 mt-1">
                        <div className={`h-2 flex-1 rounded-full ${progress >= 33 ? 'bg-primary' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${progress >= 66 ? 'bg-primary' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full ${progress >= 100 ? 'bg-primary' : 'bg-gray-200'}`} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowFundingModal(true)}
                        className="flex-1 bg-primary/5 text-primary hover:bg-primary/10 py-3 rounded-2xl border border-primary/20 transition-all font-bold text-sm"
                    >
                        Fund Escrow Account
                    </button>
                </div>
            </div>

            {/* Funding Modal */}
            {showFundingModal && (
                <ModalMobile
                    onClose={() => setShowFundingModal(false)}
                    Content={() => (
                        <FundJobModal
                            onClose={() => setShowFundingModal(false)}
                            onConfirm={handleConfirmFunding}
                            isConfirming={false}
                            error={null}
                            amount={typeof totalPrice === 'string' ? parseInt(totalPrice.replace(/,/g, ''), 10) || 0 : totalPrice}
                            virtualAccount={virtualAccount}
                        />
                    )}
                    direction="bottom"
                />
            )}
        </>
    )
}

export default JobCard