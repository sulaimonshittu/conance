import WelcomeArtisan from "@lib/components/artisan/artisan-home/WelcomeArtisan"
import ActiveWork from "@lib/components/artisan/artisan-home/ActiveWork"
import IncomingRequests from "@lib/components/artisan/artisan-home/incoming-requests/IncomingRequests"
import JobRecommendations from "@lib/components/artisan/artisan-home/JobRecommendations"

const ArtisanHome = () => {

    return (
        <section className="pt-s4 pb-s5">
            <WelcomeArtisan />
            <JobRecommendations />
            <IncomingRequests />
            <ActiveWork />
        </section>
    )
}

export default ArtisanHome