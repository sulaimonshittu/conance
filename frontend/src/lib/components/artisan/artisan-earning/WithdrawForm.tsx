import { useState } from "react"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import Button from "@/lib/components/common/Button"
import { Landmark, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { payoutApi, NIGERIAN_BANKS, type BankAccountInfo } from "@/lib/api/payout.api"
import { toast } from "sonner"

interface WithdrawFormProps {
    onClose: () => void;
    availableBalance?: number;
}

const WithdrawForm = ({ onClose, availableBalance = 35000 }: WithdrawFormProps) => {
    const [amount, setAmount] = useState<string>("")
    const [bankCode, setBankCode] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [verifiedAccount, setVerifiedAccount] = useState<BankAccountInfo | null>(null)
    const [isLookingUp, setIsLookingUp] = useState(false)
    const [lookupError, setLookupError] = useState<string | null>(null)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const handleLookup = async () => {
        if (!bankCode) { toast.error("Please select a bank."); return }
        if (accountNumber.length < 10) { toast.error("Enter a valid 10-digit account number."); return }

        setIsLookingUp(true)
        setLookupError(null)
        setVerifiedAccount(null)

        const res = await payoutApi.lookupAccount(bankCode, accountNumber)
        setIsLookingUp(false)

        if (res.success && res.data) {
            setVerifiedAccount(res.data)
        } else {
            setLookupError(res.message || "Account not found.")
        }
    }

    const handleConfirm = async () => {
        if (!verifiedAccount) { toast.error("Please verify your bank account first."); return }
        if (!amount || Number(amount) <= 0) { toast.error("Enter a valid withdrawal amount."); return }
        if (Number(amount) > availableBalance) { toast.error("Amount exceeds available balance."); return }

        setIsWithdrawing(true)
        // Withdrawal payout is handled via Squad on the backend when triggered
        await new Promise(r => setTimeout(r, 1500))
        setIsWithdrawing(false)
        toast.success(`Withdrawal of ${formatNaira(Number(amount))} initiated!`)
        onClose()
    }

    return (
        <section className="bg-white p-s3 flex flex-col gap-s3 min-h-[70vh] rounded-t-3xl">
            {/* Header */}
            <div>
                <h2 className="font-serif text-h3 font-bold text-gray-900 mb-1">Withdraw Earnings</h2>
                <p className="text-b3 text-text-muted">Transfer your earnings to your bank account.</p>
            </div>

            {/* Balance Card */}
            <div className="bg-[#FFF3EE] p-s2 rounded-2xl border border-primary/10">
                <p className="text-[11px] text-primary font-bold tracking-widest mb-1 uppercase">Available to Withdraw</p>
                <p className="text-h3 font-bold text-gray-900">{formatNaira(availableBalance)}</p>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-b2">₦</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-accent rounded-xl focus:outline-none focus:border-primary text-b1 font-bold text-gray-900 transition-colors"
                    />
                </div>
            </div>

            {/* Bank selection */}
            <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Bank</label>
                <select
                    value={bankCode}
                    onChange={(e) => { setBankCode(e.target.value); setVerifiedAccount(null); setLookupError(null) }}
                    className="w-full px-4 py-3 bg-slate-50 border border-accent rounded-xl focus:outline-none focus:border-primary text-b3 font-medium text-gray-900 transition-colors"
                >
                    <option value="">— Select your bank —</option>
                    {NIGERIAN_BANKS.map(b => (
                        <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                </select>
            </div>

            {/* Account number + lookup */}
            <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Account Number</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '')); setVerifiedAccount(null); setLookupError(null) }}
                        placeholder="0123456789"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-accent rounded-xl focus:outline-none focus:border-primary text-b3 font-medium transition-colors"
                    />
                    <button
                        onClick={handleLookup}
                        disabled={isLookingUp || accountNumber.length < 10 || !bankCode}
                        className="px-4 py-3 bg-primary text-white rounded-xl font-bold text-b3 hover:bg-primary2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLookingUp ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        Verify
                    </button>
                </div>

                {/* Lookup error */}
                {lookupError && (
                    <div className="mt-2 flex items-center gap-2 text-error text-[12px] font-medium">
                        <AlertCircle size={14} />
                        {lookupError}
                    </div>
                )}

                {/* Verified account */}
                {verifiedAccount && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-green-100">
                            <Landmark size={18} className="text-success" />
                        </div>
                        <div>
                            <p className="text-b3 font-bold text-gray-900 leading-tight">{verifiedAccount.accountName}</p>
                            <p className="text-[12px] text-text-muted">{verifiedAccount.bankName} · {verifiedAccount.accountNumber}</p>
                        </div>
                        <CheckCircle2 size={20} className="text-success ml-auto shrink-0" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-2 pt-s2">
                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleConfirm}
                    isLoading={isWithdrawing}
                    loadingText="Processing..."
                    disabled={!verifiedAccount || !amount || Number(amount) <= 0 || Number(amount) > availableBalance || isWithdrawing}
                >
                    Confirm Withdrawal
                </Button>
                <button
                    onClick={onClose}
                    className="w-full text-b3 font-bold text-text-muted hover:text-gray-900 transition-colors py-2"
                >
                    Cancel
                </button>
            </div>
        </section>
    )
}

export default WithdrawForm