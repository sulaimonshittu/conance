import { useEffect, useState } from 'react'
import ArtisanDetailsCard from '../ArtisanDetailsCard'
import { MOCK_TOP_ARTISANS, type Artisan } from '@/lib/utils/mockData'
import { Loader2, AlertCircle } from 'lucide-react'

const TopRatedArtisansNearYou = () => {
    const [artisans, setArtisans] = useState<Artisan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Simulate API call
    const fetchTopArtisans = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Simulate network latency
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Randomly simulate an error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error("Failed to fetch nearby artisans. Please check your connection.")
            }

            setArtisans(MOCK_TOP_ARTISANS)
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTopArtisans()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-s5 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-text-muted font-medium text-sm">Finding top-rated artisans near you...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-s5 px-s3 text-center min-h-[300px]">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-error" />
                </div>
                <h3 className="text-b1 font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-b3 text-text-muted mb-6 max-w-[280px]">{error}</p>
                <button
                    onClick={fetchTopArtisans}
                    className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary2 transition-colors active:scale-95 shadow-lg shadow-primary/20"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-s3 px-s3 py-s4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-h4 font-bold text-gray-900 tracking-tight">
                    Top-rated near you
                </h2>
                <button className="text-primary text-[13px] font-bold hover:underline">
                    View all
                </button>
            </div>

            <div className="flex flex-col gap-s3">
                {artisans.map((artisan) => (
                    <ArtisanDetailsCard
                        key={artisan.id}
                        {...artisan}
                    />
                ))}
            </div>
        </div>
    )
}

export default TopRatedArtisansNearYou