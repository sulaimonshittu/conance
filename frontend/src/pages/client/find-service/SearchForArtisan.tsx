import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArtisanDetailsCard from '@/lib/components/client/ArtisanDetailsCard'
import useArtisanStore from '@/lib/hooks/useArtisanStore'
import { Loader2, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchForArtisan = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ""
    const navigate = useNavigate()
    
    const [localQuery, setLocalQuery] = useState(query)
    const { searchResults, isLoading, error, searchArtisans } = useArtisanStore()

    // Sync local query when URL changes (e.g. back navigation)
    useEffect(() => {
        setLocalQuery(query)
    }, [query])

    useEffect(() => {
        searchArtisans(query)
    }, [query, searchArtisans])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (localQuery.trim() !== query) {
            setSearchParams({ q: localQuery.trim() })
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-accent/10 px-s3 py-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <input 
                        type="text" 
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Search for artisans..."
                        className="w-full bg-gray-50 border border-accent/50 rounded-xl px-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                </form>
            </header>

            <div className="flex-1 p-s3">
                <div className="mb-6">
                    <h1 className="text-h4 font-bold text-gray-900 leading-tight">
                        {query ? `Results for "${query}"` : "Top artisans for you"}
                    </h1>
                    <p className="text-b3 text-text-muted font-medium mt-1">
                        {isLoading ? "Searching..." : `${searchResults.length} artisans found`}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-text-muted font-medium">Fetching best matches...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-6 rounded-3xl text-center border border-red-100">
                        <p className="text-red-600 font-bold mb-2">Search failed</p>
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="flex flex-col gap-s3 pb-24">
                        {searchResults.map((artisan) => (
                            <ArtisanDetailsCard
                                key={artisan.id}
                                {...artisan}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-s4">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-b1 font-bold text-gray-900 mb-1">No results found</h3>
                        <p className="text-b3 text-text-muted">Try searching for something else like "Carpenter" or "Painter"</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchForArtisan
