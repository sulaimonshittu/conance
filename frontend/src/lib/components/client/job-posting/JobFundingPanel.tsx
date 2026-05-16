import { useState } from "react";
import {
    ShieldCheck,
    Loader2,
    Copy,
    Check,
    Wallet,
} from "lucide-react";

export interface VirtualAccountInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export const FundJobModal = ({
    onClose,
    onConfirm,
    isConfirming,
    error,
    amount,
    virtualAccount,
}: {
    onClose: () => void;
    onConfirm: () => void;
    isConfirming: boolean;
    error: string | null;
    amount: number;
    virtualAccount: VirtualAccountInfo;
}) => {
    const [copied, setCopied] = useState(false);

    const copyAccount = () => {
        navigator.clipboard.writeText(virtualAccount.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-s3 space-y-5 bg-white rounded-t-3xl">
            {/* Header */}
            <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet size={26} className="text-primary" />
                </div>
                <h3 className="text-h4 font-bold text-gray-900">Fund Job Wallet</h3>
                <p className="text-b3 text-text-muted mt-1">
                    Transfer the required amount to secure the artisan
                </p>
            </div>

            {/* Required Amount */}
            <div className="bg-[#FAF7F2] rounded-2xl px-4 py-3 flex items-center justify-between border border-accent/20">
                <span className="text-[12px] text-text-muted font-bold uppercase tracking-widest">Required</span>
                <span className="text-h4 font-bold text-primary">
                    ₦{amount.toLocaleString()}
                </span>
            </div>

            {/* Virtual Account */}
            <div className="bg-[#FAF7F2] p-s3 rounded-3xl border border-accent/20 space-y-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Bank Name</span>
                    <span className="text-b1 font-bold text-gray-900">{virtualAccount.bankName}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Number</span>
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-accent shadow-sm">
                        <span className="text-h4 font-bold text-primary tracking-widest">
                            {virtualAccount.accountNumber}
                        </span>
                        <button
                            onClick={copyAccount}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {copied
                                ? <Check size={18} className="text-green-600" />
                                : <Copy size={18} className="text-primary" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Account Name</span>
                    <span className="text-b2 font-bold text-gray-900">{virtualAccount.accountName}</span>
                </div>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
                    Funds are held in secure escrow. They are only released when you approve a milestone — never before.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
                    <p className="text-[12px] text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* CTA */}
            <button
                onClick={onConfirm}
                disabled={isConfirming}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isConfirming ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Confirming transfer...
                    </>
                ) : (
                    <>
                        <Check size={18} />
                        I've Made the Transfer
                    </>
                )}
            </button>

            <button
                onClick={onClose}
                className="w-full text-text-muted text-sm font-medium py-2 hover:text-gray-900 transition-colors"
            >
                Cancel
            </button>
        </div>
    );
};

export default FundJobModal;
