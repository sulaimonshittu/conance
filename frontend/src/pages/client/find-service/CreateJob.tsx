import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import useJobPostingStore from "@/lib/hooks/useJobPostingStore";

import JobInputTabs from "@/lib/components/client/job-posting/JobInputTabs";
import VoiceRecorder from "@/lib/components/client/job-posting/VoiceRecorder";
import TextJobForm from "@/lib/components/client/job-posting/TextJobForm";
import PriceEstimate from "@/lib/components/client/job-posting/PriceEstimate";
import RecommendedArtisans from "@/lib/components/client/job-posting/RecommendedArtisans";
import JobSummary from "@/lib/components/client/job-posting/JobSummary";
import JobPostActions from "@/lib/components/client/job-posting/JobPostActions";
import UploadState from "@/lib/components/client/job-posting/UploadState";
import FundingModal from "@/lib/components/client/job-posting/FundingModal";
import { useState } from "react";


const CreateJob = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const artisanId = searchParams.get("artisanId"); // Pre-fill artisan from ArtisanDetails
    const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);

    const {
        draft,
        activeTab,
        aiAnalysis,
        isAnalysing,
        analysisError,
        isSubmitting,
        submittedJob,
        setActiveTab,
        analyseJob,
        submitJob,
        resetDraft,
        clearErrors,
    } = useJobPostingStore();


    // Reset store on mount to avoid stale data from previous visits
    useEffect(() => {
        resetDraft();
        if (artisanId) {
            // If coming from artisan details, pre-fill artisanId in metadata (future use)
            // store.updateDraft({ artisanId }); — when backend field is added
        }
        return () => clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async () => {
        await submitJob();
        // submittedJobId will be set in store — success state handled below
    };

    // ── Success State ────────────────────────────────────────────
    if (submittedJob) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] flex flex-col items-center justify-center p-s3 text-center">
                <div className="bg-green-50 p-6 rounded-full mb-6 shadow-sm">
                    <CheckCircle2 size={56} className="text-green-600" />
                </div>
                <h1 className="text-h3 font-bold text-gray-900 mb-2">Job Posted!</h1>
                <p className="text-b3 text-text-muted mb-8 max-w-[280px]">
                    Your job is now live. {submittedJob.squadVirtualAccount ? "Please fund the escrow wallet to start receiving proposals." : "Artisans will start sending proposals shortly."}
                </p>

                {submittedJob.squadVirtualAccount && (
                    <div className="w-full max-w-[320px] bg-white p-s3 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 mb-8 animate-in fade-in zoom-in-95 duration-500">
                        <p className="text-[11px] text-primary font-extrabold uppercase tracking-widest mb-3">Temporary Escrow Wallet</p>
                        <div className="flex flex-col gap-1 mb-4">
                            <span className="text-h4 font-serif font-extrabold text-gray-900 tracking-wider">{submittedJob.squadVirtualAccount}</span>
                            <span className="text-[12px] text-text-muted font-bold italic">Squad Virtual Account (GTBank)</span>
                        </div>
                        <button
                            onClick={() => setIsFundingModalOpen(true)}
                            className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} />
                            Fund This Job
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-3 w-full max-w-[320px]">
                    {!submittedJob.squadVirtualAccount && (
                         <button
                            onClick={() => navigate("/client/jobs")}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            View My Jobs
                        </button>
                    )}
                    <button
                        onClick={() => navigate("/client/jobs")}
                        className="w-full border border-accent py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => { resetDraft(); }}
                        className="w-full text-b3 text-text-muted font-bold hover:text-gray-900 py-2 transition-colors"
                    >
                        Post Another Job
                    </button>
                </div>

                {isFundingModalOpen && submittedJob.squadVirtualAccount && (
                    <FundingModal 
                        onClose={() => setIsFundingModalOpen(false)}
                        accountNumber={submittedJob.squadVirtualAccount}
                        jobTitle={submittedJob.title}
                        budgetKobo={submittedJob.budgetKobo}
                    />
                )}
            </div>
        );
    }


    // ── Analysing full-screen overlay ────────────────────────────
    if (isAnalysing) {
        return (
            <div className="min-h-screen bg-[#FCF9F6] flex items-center justify-center">
                <UploadState message="AI is analysing your job..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FCF9F6] pb-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-accent/10 px-s3 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-b1 font-bold text-gray-900">Post a Job</h1>
                    <p className="text-[12px] text-text-muted font-medium">Describe what you need done</p>
                </div>
            </header>

            <div className="px-s3 py-s4 flex flex-col gap-s4">
                {/* Input Method Tabs */}
                <JobInputTabs activeTab={activeTab} onChange={setActiveTab} />

                {/* Input Content */}
                <div className="bg-white rounded-3xl border border-accent/10 shadow-sm p-s3">
                    {activeTab === "voice" ? <VoiceRecorder /> : <TextJobForm />}
                </div>

                {/* AI Analysis Results */}
                {aiAnalysis && (
                    <>
                        {/* Detected Category & Tags */}
                        <div className="flex flex-col gap-2">
                            <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest px-1">
                                Detected category
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[13px] font-bold">
                                    {aiAnalysis.detectedCategory}
                                </span>
                                {aiAnalysis.tags.map((tag) => (
                                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl text-[12px] font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${aiAnalysis.confidence}%` }}
                                    />
                                </div>
                                <span className="text-[11px] text-green-600 font-bold whitespace-nowrap">
                                    {aiAnalysis.confidence}% match
                                </span>
                            </div>
                        </div>

                        {/* Price Estimate */}
                        <PriceEstimate
                            estimate={aiAnalysis.pricingEstimate}
                            onRefresh={analyseJob}
                        />

                        {/* Recommended Artisans */}
                        <RecommendedArtisans
                            recommendations={aiAnalysis.recommendedArtisans}
                            isLoading={isAnalysing}
                            error={analysisError}
                            onRetry={analyseJob}
                        />

                        {/* Job Summary */}
                        <JobSummary draft={draft} />
                    </>
                )}

                {/* Error from analysis */}
                {analysisError && !isAnalysing && (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                        <p className="text-[13px] text-red-600 font-medium">{analysisError}</p>
                    </div>
                )}

                {/* Primary Actions */}
                <JobPostActions
                    onAnalyse={analyseJob}
                    onSubmit={handleSubmit}
                    isAnalysing={isAnalysing}
                    isSubmitting={isSubmitting}
                    hasDescription={draft.description.trim().length > 10}
                    hasAnalysis={!!aiAnalysis}
                />
            </div>
        </div>
    );
};

export default CreateJob;