import ActiveProjects from "@/lib/components/artisan/artisan-projects/ActiveProjects"
import FinishedProjects from "@/lib/components/artisan/artisan-projects/FinishsedProjects"

const Work = () => {
    return (
        <section>
            <header className="flex flex-col mb-s3">
                <h1 className="font-bold text-h1 text-gray-900">
                    My Work
                </h1>
                <p className="text-b2 text-text-muted">
                    Check out your ongoing and past works
                </p>
            </header>

            <section className="flex flex-col gap-s2">
                <ActiveProjects />
                <FinishedProjects />
            </section>
        </section>
    )
}

export default Work