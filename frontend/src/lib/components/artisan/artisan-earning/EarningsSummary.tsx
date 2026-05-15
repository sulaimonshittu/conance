import { TrendingUp, Clock, CreditCard } from "lucide-react"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"
import { useState } from "react"
import ModalMobile from "@/lib/components/common/modals/ModalMobile"
import WithdrawForm from "./WithdrawForm"
import useAuthStore from "@/lib/hooks/useAuthStore"




const EarningsSummary = () => {
    const { user } = useAuthStore()
    const [withdraw, setWithdraw] = useState<boolean>(false)

    const EARNINGS_DATA = [
        {
            title: "Total Earned",
            amount: 85000, // Still mock until backend supports history
            footer: "All-time earnings",
            icon: TrendingUp,
            iconBg: "bg-[#FFF3EE]",
            iconColor: "text-primary",
        },
        {
            title: "Pending Payout",
            amount: 60000, // Still mock until backend supports active escrow
            footer: "In active projects",
            icon: Clock,
            iconBg: "bg-green-50",
            iconColor: "text-green-700",
        },
        {
            title: "Available Balance",
            amount: user?.walletBalance || 0,
            footer: "Withdraw to bank",
            icon: CreditCard,
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-700",
            footerAction: true,
            withdraw: () => { setWithdraw(true) }
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-s3">
            {EARNINGS_DATA.map((item, index) => {
                const Icon = item.icon
                return (
                    <div key={index} className="bg-white rounded-2xl p-s3 border border-accent shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-s1 mb-s1">
                            <div className={`p-s1 rounded-xl ${item.iconBg} ${item.iconColor}`}>
                                <Icon size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-b3 text-text-muted font-medium uppercase tracking-tight">{item.title}</span>
                        </div>

                        <div className="mt-s1">
                            <p className="font-serif text-h2 font-extrabold text-gray-900 tracking-tight">
                                {formatNaira(item.amount)}
                            </p>
                            <button 
                                onClick={() => item.withdraw?.()} 
                                className={`text-b3 mt-s1 font-medium ${item.footerAction ? 'text-primary cursor-pointer hover:underline' : 'text-text-muted opacity-60'}`}
                            >
                                {item.footer}
                            </button>
                        </div>
                    </div>
                )
            })}

            {withdraw && (
                <ModalMobile
                    onClose={() => setWithdraw(false)}
                    //isOpen={withdraw}
                    Content={WithdrawForm}
                    direction="bottom"
                />
            )}
        </div>
    )
}

export default EarningsSummary