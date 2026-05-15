import Hero from "@/lib/components/client/home/Hero"
import TopRatedArtisansNearYou from "@/lib/components/client/home/TopRatedArtisansNearYou"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"

const ClientHome = () => {
    const [query, setQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/client/search-artisan?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pb-24">
            <Hero />

            {/* Search for artisan */}
            <div className="px-s3 ">
                <form onSubmit={handleSearch} className="flex gap-s2">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for artisans (e.g. Carpenter, Painter)"
                            className="w-full bg-white border border-accent rounded-2xl px-12 py-s2 shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-b2 font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white px-5 py-s1 rounded-xl text-sm font-bold hover:bg-primary2 transition-colors active:scale-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            <TopRatedArtisansNearYou />
        </div>
    )
}

export default ClientHome