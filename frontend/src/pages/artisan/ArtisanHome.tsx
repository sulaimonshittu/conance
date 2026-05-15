import WelcomeArtisan from "@lib/components/artisan/artisan-home/WelcomeArtisan"
import ActiveWork from "@lib/components/artisan/artisan-home/ActiveWork"
import IncomingRequests from "@lib/components/artisan/artisan-home/incoming-requests/IncomingRequests"

const ArtisanHome = () => {

    return (
        <section className="pt-s4 pb-s5">
            <WelcomeArtisan />
            <IncomingRequests />
            <ActiveWork />
        </section>
    )
}

export default ArtisanHome