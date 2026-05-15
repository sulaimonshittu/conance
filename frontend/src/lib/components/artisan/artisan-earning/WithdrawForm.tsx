import { useState } from "react"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import Button from "@/lib/components/common/Button"
import { Landmark } from "lucide-react"

interface WithdrawFormProps {
    onClose: () => void;
}

const WithdrawForm = ({ onClose }: WithdrawFormProps) => {
    const [amount, setAmount] = useState<string>("")
    const availableAmount = 35000 // Mock available balance

    const handleConfirm = () => {
        // Handle withdrawal logic here
        console.log("Processing withdrawal for:", amount);
        onClose();
    };

    return (
        <section className="bg-white p-s3 flex flex-col h-full min-h-[60vh] rounded-t-3xl">
            {/* Header */}
            <div className="mb-s3">
                <h2 className="font-serif text-h2 font-bold text-gray-900 mb-s1">Withdraw Earnings</h2>
                <p className="text-b2 text-text-muted">Transfer your earnings securely to your linked bank account.</p>
            </div>

            {/* Balance Card */}
            <div className="bg-[#FFF3EE] p-s2 rounded-2xl border border-primary/10 mb-s4">
                <p className="text-b3 text-primary font-semibold tracking-widest mb-1">Available to Withdraw</p>
                <p className="text-h3 font-bold text-gray-900">{formatNaira(availableAmount)}</p>
            </div>

            {/* Input and Bank Info */}
            <div className="space-y-s4 flex-1">
                <div>
                    <label className="block text-b3 font-bold text-gray-900 mb-s1">Amount to Withdraw</label>
                    <div className="relative">
                        <span className="absolute left-s2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-b2">₦</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-s2 py-s2 bg-slate-50 border border-accent rounded-xl focus:outline-none focus:border-primary text-b1 font-bold text-gray-900 transition-colors"
                        />
                    </div>
                </div>

                <div className="p-s2 bg-slate-50 border border-accent rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-s2">
                        <div className="p-s1 bg-white rounded-lg shadow-sm border border-accent/20">
                            <Landmark size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-b3 font-bold text-gray-900 leading-tight">Access Bank</p>
                            <p className="text-b3 text-text-muted">0123456789 • John Artisan</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">
                        Change
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-s5 space-y-s2">
                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleConfirm}
                    disabled={!amount || Number(amount) <= 0 || Number(amount) > availableAmount}
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