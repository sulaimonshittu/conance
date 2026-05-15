import ActiveProjectCard from "./ActiveProjectCard"
import { MOCK_ACTIVE_PROJECTS } from "@/lib/utils/mockData"

const ActiveProjects = () => {
    return (
        <div className="flex flex-col gap-s3">
            <h3 className="font-semibold text-h4 text-gray-900 my-2">
                Active Projects
            </h3>
            {MOCK_ACTIVE_PROJECTS.map((project) => (
                <ActiveProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}

export default ActiveProjects
