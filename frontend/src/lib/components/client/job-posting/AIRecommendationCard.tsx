import { Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AIRecommendation } from "@/lib/api/job.api";

interface AIRecommendationCardProps {
    rec: AIRecommendation;
}

const AIRecommendationCard = ({ rec }: AIRecommendationCardProps) => {
    const navigate = useNavigate();

    const scoreColor =
        rec.matchScore >= 90 ? "text-green-600 bg-green-50"
        : rec.matchScore >= 75 ? "text-blue-600 bg-blue-50"
        : "text-orange-600 bg-orange-50";

    return (
        <div className="bg-white p-s3 rounded-3xl border border-accent/10 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <img
                            src={rec.artisanAvatar}
                            alt={rec.artisanName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <span className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white ${scoreColor}`}>
                            {rec.matchScore}%
                        </span>
                    </div>
                    <div>
                        <h4 className="text-b2 font-bold text-gray-900">{rec.artisanName}</h4>
                        <p className="text-[12px] text-text-muted font-medium">{rec.artisanTitle}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Zap size={12} className="text-primary" />
                            <span className="text-[11px] font-bold text-primary">AI Match</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-b2 font-bold text-primary">₦{rec.estimatedPrice.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={11} className="text-text-muted" />
                        <span className="text-[11px] text-text-muted font-medium">{rec.estimatedDuration}</span>
                    </div>
                </div>
            </div>

            {/* AI Reasoning */}
            <div className="bg-[#F0F4F2] px-3 py-2 rounded-xl">
                <p className="text-[12px] text-[#3B7A5F] font-medium">{rec.reasoning}</p>
            </div>

            {/* Suggested Materials */}
            {rec.suggestedMaterials && (
                <div className="flex flex-wrap gap-1.5">
                    {rec.suggestedMaterials.map((mat, i) => (
                        <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                            {mat}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => navigate(`/client/artisan-details/${rec.artisanId}`)}
                    className="flex-1 border border-accent rounded-2xl py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                    View Profile
                </button>
                <button
                    onClick={() => navigate(`/client/chat?id=${rec.artisanId}`)}
                    className="flex-[2] bg-primary text-white rounded-2xl py-3 text-sm font-bold hover:bg-primary2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    Hire Now
                </button>
            </div>
        </div>
    );
};

export default AIRecommendationCard;
