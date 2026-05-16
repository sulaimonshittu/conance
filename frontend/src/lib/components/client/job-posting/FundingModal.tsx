import React, { useState } from 'react'
import { ShieldCheck, Copy, Check, Info } from 'lucide-react'
import ModalMobile from '@/lib/components/common/modals/ModalMobile'

interface FundingModalProps {
    onClose: () => void;
    accountNumber: string;
    jobTitle: string;
    budgetKobo?: number;
}

const FundingModal: React.FC<FundingModalProps> = ({ onClose, accountNumber, jobTitle, budgetKobo }) => {
    return (
        <ModalMobile
            onClose={onClose}
            Content={() => (
                <FundingContent 
                    accountNumber={accountNumber} 
                    jobTitle={jobTitle} 
                    budgetKobo={budgetKobo}
                    onClose={onClose}
                />
            )}
        />
    )
}

const FundingContent = ({ accountNumber, jobTitle, budgetKobo, onClose }: FundingModalProps) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(accountNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const budgetNaira = budgetKobo ? budgetKobo / 100 : 0

    return (
        <div className="p-s3 space-y-6 bg-white min-h-[70vh] rounded-t-3xl">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={32} className="text-primary" />
                </div>
                <h3 className="text-h4 font-bold text-gray-900 leading-tight">Fund Escrow for Job</h3>
                <p className="text-b3 text-text-muted mt-2">
                    {jobTitle}
                </p>
            </div>

            {/* Budget Info */}
            {budgetNaira > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-accent/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-text-muted">
                        <Info size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Estimated Budget</span>
                    </div>
                    <span className="text-b1 font-extrabold text-gray-900">₦{budgetNaira.toLocaleString()}</span>
                </div>
            )}

            {/* Account Details Box */}
            <div className="bg-[#FAF7F2] p-s3 rounded-[2.5rem] border border-accent/30 space-y-6">
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Bank Name</span>
                    <span className="text-b1 font-bold text-gray-900 italic">Squad Virtual Account (GTBank)</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Number</span>
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl border border-accent shadow-sm">
                        <span className="text-h3 font-serif font-extrabold text-primary tracking-[0.2em]">
                            {accountNumber}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-90"
                        >
                            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-primary" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Name</span>
                    <span className="text-b2 font-bold text-gray-900">Conance Escrow - {jobTitle.slice(0, 20)}...</span>
                </div>
            </div>

            {/* Safety Banner */}
            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <p className="text-[12px] text-blue-800 font-medium leading-relaxed">
                    Transfer any amount to this account. Funds are held securely in escrow and only released to the artisan once you approve their completed work.
                </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-3">
                <button
                    onClick={onClose}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                    I've Made the Transfer
                </button>
                <button
                    onClick={onClose}
                    className="w-full text-b3 text-text-muted font-bold hover:text-gray-900 transition-colors"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    )
}

export default FundingModal
