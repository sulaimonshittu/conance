import { useEffect } from 'react'
import Summary from '@/lib/components/client/wallet/Summary'
import Transactions from '@/lib/components/client/wallet/Transactions'
import useWalletStore from '@/lib/hooks/useWalletStore'
import { Loader2, AlertCircle } from 'lucide-react'

const Wallet = () => {
    const { summary, isLoading, error, fetchSummary } = useWalletStore()

    useEffect(() => {
        fetchSummary()
    }, [fetchSummary])

    if (isLoading && !summary) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-text-muted font-bold text-sm">Preparing your wallet...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] p-s3 flex flex-col items-center justify-center text-center">
                <div className="bg-red-50 p-5 rounded-full mb-4">
                    <AlertCircle className="w-10 h-10 text-error" />
                </div>
                <h2 className="text-h4 font-bold text-gray-900 mb-2">Wallet unavailable</h2>
                <p className="text-b3 text-text-muted mb-8 max-w-[280px]">
                    {error}
                </p>
                <button 
                    onClick={() => fetchSummary()}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            <header className="px-s3 pt-s4 pb-s3">
                <h1 className="text-h3 font-bold text-gray-900">Your Wallet</h1>
                <p className="text-b3 text-text-muted font-medium mt-1">
                    Manage your funds and escrow payments
                </p>
            </header>

            <div className="px-s3 space-y-s5">
                {summary && (
                    <Summary 
                        escrow={summary.escrow}
                        released={summary.released}
                        balance={summary.balance}
                        accountDetails={summary.accountDetails}
                    />
                )}

                <div className="space-y-s3">
                    <h3 className="text-b1 font-bold text-gray-900 px-1">Recent Transactions</h3>
                    <Transactions />
                </div>
            </div>
        </div>
    )
}

export default Wallet