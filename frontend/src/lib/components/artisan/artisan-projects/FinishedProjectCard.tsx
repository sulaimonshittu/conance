import { Link } from "react-router-dom"
import { type FinishedProject } from "@/lib/utils/mockData"
import { formatNaira } from "@/lib/components/artisan/artisan-requests/RequestCard"

interface FinishedProjectCardProps {
  job: FinishedProject
}

const FinishedProjectCard = ({ job }: FinishedProjectCardProps) => {
  return (
    <Link
      to={`/artisan/completed-job/${job.id}`}
      className="block bg-white rounded-2xl p-s3 border border-accent hover:border-primary/30 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-s2">
          <img
            src={job.customerAvatar}
            alt={job.customerName}
            className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
          />
          <div>
            <h3 className="font-serif text-h4 font-bold text-gray-900 mb-0.5 leading-tight">
              {job.title}
            </h3>
            <p className="text-b3 text-text-muted font-medium">
              {job.customerName}
            </p>
            <div className="flex items-center gap-s2 mt-s1">
              <span className="px-s1 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                Completed
              </span>
              <span className="text-[10px] text-text-muted font-medium">
                {job.completedDate.toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-h3 font-bold text-primary">
            {formatNaira(job.totalAmount)}
          </p>
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">
            Fully paid
          </p>
        </div>
      </div>
    </Link>
  )
}

export default FinishedProjectCard