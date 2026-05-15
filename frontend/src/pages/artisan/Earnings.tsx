import EarningsSummary from "@/lib/components/artisan/artisan-earning/EarningsSummary"
import TransactionHistory from "@/lib/components/artisan/artisan-earning/TransactionHistory"

const Earnings = () => {
    return (
        <section>
            <header>
                <h1 className="font-bold text-h1 text-gray-900">
                    My Earnings
                </h1>
                <p className="text-b2 text-text-muted">
                    Track your income and manage payouts
                </p>
            </header>
            <EarningsSummary />
            <TransactionHistory />
        </section>
    )
}

export default Earnings