
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react'

const MOCK_TRANSACTIONS = [
    {
        id: 1,
        type: 'escrow',
        title: 'Held for "Custom Bookshelf"',
        amount: 85000,
        date: 'Today, 2:15 PM',
        status: 'pending'
    },
    {
        id: 2,
        type: 'release',
        title: 'Released to Tunde Adeyemi',
        amount: 25000,
        date: 'Yesterday, 10:30 AM',
        status: 'success'
    },
    {
        id: 3,
        type: 'fund',
        title: 'Wallet Funded via Transfer',
        amount: 150000,
        date: '12 May, 2024',
        status: 'success'
    }
]

const Transactions = () => {
    return (
        <div className="flex flex-col gap-3">
            {MOCK_TRANSACTIONS.map((tx) => (
                <div
                    key={tx.id}
                    className="bg-white p-4 rounded-2xl border border-accent/10 shadow-sm flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${tx.type === 'fund' ? 'bg-green-50 text-green-600' :
                                tx.type === 'release' ? 'bg-blue-50 text-blue-600' :
                                    'bg-orange-50 text-orange-600'
                            }`}>
                            {tx.type === 'fund' ? <ArrowDownLeft size={20} /> :
                                tx.type === 'release' ? <ArrowUpRight size={20} /> :
                                    <Clock size={20} />}
                        </div>
                        <div>
                            <p className="text-b3 font-bold text-gray-900 leading-tight">
                                {tx.title}
                            </p>
                            <p className="text-[11px] text-text-muted font-medium mt-0.5">
                                {tx.date}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-b2 font-bold ${tx.type === 'fund' ? 'text-green-600' : 'text-gray-900'
                            }`}>
                            {tx.type === 'fund' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'success' ? 'text-green-500' : 'text-orange-500'
                            }`}>
                            {tx.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Transactions