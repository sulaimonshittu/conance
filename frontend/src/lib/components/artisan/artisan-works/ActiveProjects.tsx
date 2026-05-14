import ActiveProjectCard from "./ActiveProjectCard"
import { MOCK_ACTIVE_PROJECTS } from "@/lib/utils/mockData"

const ActiveProjects = () => {
    return (
        <div className="flex flex-col gap-s3 bg-white">
            {MOCK_ACTIVE_PROJECTS.map((project) => (
                <ActiveProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}

export default ActiveProjects
