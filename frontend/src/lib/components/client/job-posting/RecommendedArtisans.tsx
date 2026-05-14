import { Loader2, RefreshCw, Users, AlertCircle } from "lucide-react";
import type { AIRecommendation } from "@/lib/api/job.api";
import AIRecommendationCard from "./AIRecommendationCard";

interface RecommendedArtisansProps {
    recommendations: AIRecommendation[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const RecommendedArtisans = ({
    recommendations,
    isLoading,
    error,
    onRetry
}: RecommendedArtisansProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users size={28} className="text-primary" />
                    </div>
                    <Loader2 size={20} className="absolute -top-1 -right-1 text-primary animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-b2 font-bold text-gray-900">Finding best matches...</p>
                    <p className="text-[12px] text-text-muted mt-1 animate-pulse">
                        AI is analysing your job description
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="bg-red-50 p-5 rounded-full">
                    <AlertCircle className="w-8 h-8 text-error" />
                </div>
                <div>
                    <p className="text-b2 font-bold text-gray-900 mb-1">Recommendation failed</p>
                    <p className="text-[13px] text-text-muted max-w-[250px]">{error}</p>
                </div>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary2 transition-all active:scale-95"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center px-s3">
                <div className="bg-gray-100 p-5 rounded-full">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <p className="text-b2 font-bold text-gray-900">No artisans found</p>
                    <p className="text-[13px] text-text-muted mt-1 max-w-[240px]">
                        Try providing more details about your job to get better recommendations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-s3">
            <div className="flex items-center justify-between">
                <h3 className="text-b1 font-bold text-gray-900">
                    AI Recommended ({recommendations.length})
                </h3>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-1 text-primary text-[13px] font-bold hover:underline"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>
            {recommendations.map((rec) => (
                <AIRecommendationCard key={rec.artisanId} rec={rec} />
            ))}
        </div>
    );
};

export default RecommendedArtisans;
