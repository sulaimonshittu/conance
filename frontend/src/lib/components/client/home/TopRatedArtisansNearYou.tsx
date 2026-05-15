import { useEffect, useState } from 'react'
import ArtisanDetailsCard from '../ArtisanDetailsCard'
import SliderFilter from './SliderFilter'
import { MOCK_TOP_ARTISANS, type Artisan } from '@/lib/utils/mockData'
import { Loader2, AlertCircle } from 'lucide-react'

const TopRatedArtisansNearYou = () => {
    const [artisans, setArtisans] = useState<Artisan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState('All')

    // Simulate API call
    const fetchTopArtisans = async () => {
        setIsLoading(true)
        setError(null)
        try {
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

    // Filter by category — 'All' shows everything
    const filteredArtisans = selectedCategory === 'All'
        ? artisans
        : artisans.filter(a =>
            a.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            a.skills?.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()))
        )

    if (isLoading) {
        return (
            <div className="flex flex-col gap-s3 py-s3">
                {/* Show filter skeleton while loading */}
                <div className="flex gap-2 px-s3 overflow-hidden">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-10 w-24 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center py-s5 min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-text-muted font-medium text-sm">Finding top-rated artisans near you...</p>
                </div>
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
        <div className="flex flex-col gap-s3 py-s4">
            {/* Section Header */}
            <div className="flex items-center justify-between px-s3 px-1">
                <h2 className="text-h4 font-bold text-gray-900 tracking-tight">
                    Top-rated Near You
                    <span className='text-text-muted/50 text-b3 ml-2 font-medium'>
                        ({filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''})
                    </span>
                </h2>
            </div>

            {/* Category Filter */}
            <SliderFilter selected={selectedCategory} onChange={setSelectedCategory} />

            {/* Artisan Cards */}
            <div className="flex flex-col gap-s3 px-s3">
                {filteredArtisans.length > 0 ? (
                    filteredArtisans.map((artisan) => (
                        <ArtisanDetailsCard
                            key={artisan.id}
                            {...artisan}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-100 p-5 rounded-full mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <p className="text-b2 font-bold text-gray-900">No artisans found</p>
                        <p className="text-[13px] text-text-muted mt-1">
                            No "{selectedCategory}" artisans near you yet.
                        </p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="mt-4 text-primary font-bold text-sm hover:underline"
                        >
                            Show all artisans
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopRatedArtisansNearYou