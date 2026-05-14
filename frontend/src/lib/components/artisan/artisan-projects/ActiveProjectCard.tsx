import { Link } from "react-router-dom";
import type { ActiveProject } from "@/lib/utils/mockData";
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard";

interface ActiveProjectCardProps {
  project: ActiveProject;
}

const ActiveProjectCard = ({ project }: ActiveProjectCardProps) => {
  const progress = (project.releasedAmount / project.totalAmount) * 100;

  return (
    <Link
      to={`/artisan/ongoing-job/${project.id}`}
      className="block bg-white rounded-2xl p-s3 border border-accent hover:border-primary/30 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-s3">
        <div className="flex items-start gap-s2">
          <img
            src={project.customerAvatar}
            alt={project.customerName}
            className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
          />
          <div>
            <h3 className="font-serif text-h4 font-bold text-gray-900 mb-0.5 leading-tight">
              {project.title}
            </h3>
            <p className="text-b3 text-text-muted font-medium">
              {project.customerName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-h3 font-bold text-primary">
            {formatNaira(project.totalAmount)}
          </p>
          <p className="text-b4 text-text-muted font-medium uppercase tracking-wider">
            {formatNaira(project.releasedAmount)} earned
          </p>
        </div>
      </div>

      <div className="mb-s3">
        <div className="flex items-center justify-between text-b3 mb-s1">
          <span className="text-text-muted font-medium">Overall Progress</span>
          <span className="font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-s1 bg-[#FFF3EE] rounded-full overflow-hidden border border-primary/5">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-s1">
        {project.milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${milestone.status === 'approved'
              ? 'bg-primary'
              : milestone.status === 'in-progress'
                ? 'bg-primary2/40'
                : 'bg-accent'
              }`}
          />
        ))}
      </div>
    </Link>
  );
};

export default ActiveProjectCard;