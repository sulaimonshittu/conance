import FinishedProjectCard from "./FinishedProjectCard"
import { MOCK_FINISHED_PROJECTS } from "@/lib/utils/mockData"

const FinishsedProjects = () => {
    return (
        <div className="flex flex-col gap-s3">
            <h3 className="font-semibold text-h4 text-gray-900 my-2">
                Finished Projects
            </h3>
            {MOCK_FINISHED_PROJECTS.map((job) => (
                <FinishedProjectCard key={job.id} job={job} />
            ))}
        </div>
    )
}

export default FinishsedProjects