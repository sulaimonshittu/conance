import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { MOCK_TRANSACTIONS } from "@/lib/utils/mockData"

const TransactionHistory = () => {
    return (
        <section className="mt-s4">
            <div className="flex items-center justify-between mb-s2">
                <h2 className="font-serif text-h4 font-bold text-gray-900">
                    Transaction History
                </h2>
                <button className="text-b3 font-bold text-primary hover:underline">
                    View All
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {MOCK_TRANSACTIONS
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((tx) => (
                        <div
                            key={tx.id}
                            className="bg-white p-4 rounded-2xl border border-accent/10 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${tx.type === 'earned'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {tx.type === 'earned'
                                        ? <ArrowDownLeft size={20} />
                                        : <ArrowUpRight size={20} />
                                    }
                                </div>
                                <div>
                                    <p className="text-b3 font-bold text-gray-900 leading-tight">
                                        {tx.jobTitle || 'Bank Withdrawal'}
                                    </p>
                                    <p className="text-[11px] text-text-muted font-medium mt-0.5">
                                        {tx.customerName ? `${tx.customerName} • ` : ''}
                                        {tx.date.toLocaleDateString('en-NG', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-b2 font-bold ${tx.type === 'earned' ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                    {tx.type === 'earned' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </p>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">
                                    Completed
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    )
}

export default TransactionHistory