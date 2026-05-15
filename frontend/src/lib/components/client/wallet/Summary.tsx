import React, { useState } from 'react'
import { ShieldCheck, TrendingUp, Wallet, Copy, Check } from 'lucide-react'
import ModalMobile from '@/lib/components/common/modals/ModalMobile'

interface SummaryProps {
    escrow: number;
    released: number;
    balance: number;
    accountDetails: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

const Summary: React.FC<SummaryProps> = ({ escrow, released, balance, accountDetails }) => {
    const [isFunding, setIsFunding] = useState(false)

    const SUMMARY_CARDS = [
        {
            title: "Held in Escrow",
            amount: escrow,
            subtitle: "Secured by Squad",
            icon: ShieldCheck,
            iconBg: "bg-[#F0F4F2]",
            iconColor: "text-[#3B7A5F]"
        },
        {
            title: "Total Released",
            amount: released,
            subtitle: "Paid to artisans",
            icon: TrendingUp,
            iconBg: "bg-[#FFF3EE]",
            iconColor: "text-primary"
        },
        {
            title: "Available Balance",
            amount: balance,
            subtitle: "Refundable amount",
            icon: Wallet,
            iconBg: "bg-gray-100",
            iconColor: "text-gray-600",
            canFund: true
        }
    ]

    return (
        <div className="flex flex-col gap-s3">
            {SUMMARY_CARDS.map((card, index) => {
                const Icon = card.icon
                return (
                    <div
                        key={index}
                        className="bg-white p-s3 rounded-[2rem] border border-accent/10 shadow-sm flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                                <Icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-[13px] text-text-muted font-bold uppercase tracking-wider">
                                {card.title}
                            </span>
                        </div>

                        <div>
                            <h2 className="text-h2 font-serif font-extrabold text-gray-900 leading-tight">
                                ₦{card.amount.toLocaleString()}
                            </h2>
                            <p className="text-b3 text-text-muted font-medium mt-1">
                                {card.subtitle}
                            </p>
                        </div>

                        {card.canFund && (
                            <button
                                onClick={() => setIsFunding(true)}
                                className="mt-2 w-full bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Fund Wallet
                            </button>
                        )}
                    </div>
                )
            })}

            {isFunding && (
                <ModalMobile
                    onClose={() => setIsFunding(false)}
                    Content={() => <FundWalletForm accountDetails={accountDetails} />}
                />
            )}
        </div>
    )
}

const FundWalletForm = ({ accountDetails }: { accountDetails: SummaryProps['accountDetails'] }) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(accountDetails.accountNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="p-s3 space-y-6 bg-white h-[70vh] rounded-t-3xl">
            <div className="text-center">
                <h3 className="text-h4 font-bold text-gray-900">Fund Your Wallet</h3>
                <p className="text-b3 text-text-muted mt-1">
                    Transfer any amount to the escrow account below to fund your wallet.
                </p>
            </div>

            <div className="bg-[#FAF7F2] p-s3 rounded-3xl border border-accent/20 space-y-5">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Bank Name</span>
                    <span className="text-b1 font-bold text-gray-900">{accountDetails.bankName}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Number</span>
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-accent shadow-sm">
                        <span className="text-h4 font-bold text-primary tracking-widest">
                            {accountDetails.accountNumber}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-primary" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Name</span>
                    <span className="text-b2 font-bold text-gray-900">{accountDetails.accountName}</span>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
                <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
                    Funds sent to this account are held in a secure escrow by Squad. They only become releasable once you hire an artisan.
                </p>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
            >
                I've Made the Transfer
            </button>
        </div>
    )
}

export default Summary
