import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { MOCK_TRANSACTIONS } from "@/lib/utils/mockData"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"

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

            <div className="bg-white rounded-2xl border border-accent shadow-sm overflow-hidden">
                <div className="divide-y divide-accent">
                    {MOCK_TRANSACTIONS
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-s2 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-s2">
                                    <div className={`p-s1 rounded-xl ${transaction.type === 'earned'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-orange-50 text-primary'
                                        }`}>
                                        {transaction.type === 'earned'
                                            ? <ArrowUpRight size={20} strokeWidth={2.5} />
                                            : <ArrowDownLeft size={20} strokeWidth={2.5} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-b2 font-bold text-gray-900 leading-tight">
                                            {transaction.jobTitle || 'Bank Withdrawal'}
                                        </p>
                                        <p className="text-b4 text-text-muted mt-0.5 font-medium uppercase tracking-tight">
                                            {transaction.customerName ? `${transaction.customerName} • ` : ''}
                                            {transaction.date.toLocaleDateString('en-NG', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-b2 font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                        {transaction.type === 'earned' ? '+' : '-'}{formatNaira(transaction.amount)}
                                    </p>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">
                                        {transaction.type === 'earned' ? 'Received' : 'Sent'}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    )
}

export default TransactionHistory