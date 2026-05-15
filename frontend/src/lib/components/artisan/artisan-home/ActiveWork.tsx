import Button from "@/lib/components/common/Button"
import ActiveProjectCard from "../artisan-projects/ActiveProjectCard"
import { useNavigate } from "react-router-dom"
import { useArtisan } from "@/lib/hooks/useArtisan"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

const ActiveWork = () => {
    const navigate = useNavigate()
    const { activeProjects, isLoading, fetchProjects } = useArtisan()

    useEffect(() => {
        if (activeProjects.length === 0) {
            fetchProjects()
        }
    }, [fetchProjects, activeProjects.length])

    return (
        <section className="mt-s4">
            <div className="flex justify-between mb-s3">
                <h1 className="font-bold text-h2 text-gray-900">
                    Active Work
                </h1>
                <Button variant="ghost" className="text-primary text-b2 hover:bg-transparent" onClick={() => navigate('/artisan/work')}>View All</Button>
            </div>

            {isLoading && activeProjects.length === 0 ? (
                <div className="flex justify-center py-s5">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : activeProjects.length === 0 ? (
                <div className="text-center py-s5 bg-slate-50 rounded-2xl border border-dashed border-accent">
                    <p className="text-b3 text-text-muted">No active projects at the moment.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-s3">
                    {activeProjects.slice(0, 2).map((project) => (
                        <ActiveProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default ActiveWork