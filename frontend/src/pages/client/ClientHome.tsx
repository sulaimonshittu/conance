import Hero from "@/lib/components/client/home/Hero"
import TopRatedArtisansNearYou from "@/lib/components/client/home/TopRatedArtisansNearYou"

const ClientHome = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white pb-24">
            <Hero />
            <TopRatedArtisansNearYou />
        </div>
    )
}

export default ClientHome