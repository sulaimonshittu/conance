import { Sparkles, Send, Loader2 } from "lucide-react";

interface JobPostActionsProps {
    onAnalyse: () => void;
    onSubmit: () => void;
    isAnalysing: boolean;
    isSubmitting: boolean;
    hasDescription: boolean;
    hasAnalysis: boolean;
}

const JobPostActions = ({
    onAnalyse,
    onSubmit,
    isAnalysing,
    isSubmitting,
    hasDescription,
    hasAnalysis,
}: JobPostActionsProps) => {
    return (
        <div className="flex flex-col gap-3">
            {/* Analyse with AI */}
            {!hasAnalysis && (
                <button
                    onClick={onAnalyse}
                    disabled={!hasDescription || isAnalysing}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                        !hasDescription || isAnalysing
                            ? "bg-gray-100 text-text-muted cursor-not-allowed"
                            : "bg-[#F0F4F2] text-[#3B7A5F] border border-[#E5EDE9] hover:bg-[#E5EDE9] active:scale-95"
                    }`}
                >
                    {isAnalysing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Analysing your job...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Analyse with AI & Get Recommendations
                        </>
                    )}
                </button>
            )}

            {/* Post Job */}
            <button
                onClick={onSubmit}
                disabled={!hasDescription || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                    !hasDescription || isSubmitting
                        ? "bg-gray-100 text-text-muted cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary2 active:scale-95 shadow-lg shadow-primary/20"
                }`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Posting your job...
                    </>
                ) : (
                    <>
                        <Send size={18} />
                        Post Job
                    </>
                )}
            </button>

            {!hasDescription && (
                <p className="text-[12px] text-text-muted text-center font-medium">
                    Describe your job above to continue
                </p>
            )}
        </div>
    );
};

export default JobPostActions;
