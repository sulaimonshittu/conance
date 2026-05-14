import { create } from "zustand";
import { jobApi, type JobDraft, type AIJobAnalysis } from "../api/job.api";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// State Interface
// ─────────────────────────────────────────────

interface JobPostingState {
    // Draft
    draft: JobDraft;
    activeTab: "voice" | "text";

    // Voice recording
    isRecording: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    recordingDuration: number;

    // Transcription
    isTranscribing: boolean;
    transcriptionError: string | null;

    // AI Analysis
    aiAnalysis: AIJobAnalysis | null;
    isAnalysing: boolean;
    analysisError: string | null;

    // Submission
    isSubmitting: boolean;
    submittedJobId: string | null;
    submissionError: string | null;

    // Actions
    setActiveTab: (tab: "voice" | "text") => void;
    updateDraft: (updates: Partial<JobDraft>) => void;
    resetDraft: () => void;

    setAudioBlob: (blob: Blob | null, url: string | null) => void;
    setIsRecording: (val: boolean) => void;
    setRecordingDuration: (val: number) => void;
    clearAudio: () => void;

    transcribeVoice: () => Promise<void>;
    analyseJob: () => Promise<void>;
    submitJob: () => Promise<boolean>;

    clearErrors: () => void;
}

// ─────────────────────────────────────────────
// Default Draft
// ─────────────────────────────────────────────

const DEFAULT_DRAFT: JobDraft = {
    title: "",
    description: "",
    category: "",
    location: "",
    budgetMin: 0,
    budgetMax: 0,
    voiceAudioUrl: undefined,
};

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

const useJobPostingStore = create<JobPostingState>((set, get) => ({
    draft: { ...DEFAULT_DRAFT },
    activeTab: "voice",

    isRecording: false,
    audioBlob: null,
    audioUrl: null,
    recordingDuration: 0,

    isTranscribing: false,
    transcriptionError: null,

    aiAnalysis: null,
    isAnalysing: false,
    analysisError: null,

    isSubmitting: false,
    submittedJobId: null,
    submissionError: null,

    // ── Tab ──────────────────────────────────
    setActiveTab: (tab) => set({ activeTab: tab }),

    // ── Draft ────────────────────────────────
    updateDraft: (updates) =>
        set((state) => ({ draft: { ...state.draft, ...updates } })),

    resetDraft: () =>
        set({
            draft: { ...DEFAULT_DRAFT },
            audioBlob: null,
            audioUrl: null,
            aiAnalysis: null,
            submittedJobId: null,
            transcriptionError: null,
            analysisError: null,
            submissionError: null,
        }),

    // ── Audio ────────────────────────────────
    setAudioBlob: (blob, url) => set({ audioBlob: blob, audioUrl: url }),
    setIsRecording: (val) => set({ isRecording: val }),
    setRecordingDuration: (val) => set({ recordingDuration: val }),
    clearAudio: () => set({ audioBlob: null, audioUrl: null, recordingDuration: 0 }),

    // ── Transcription ────────────────────────
    transcribeVoice: async () => {
        const { audioBlob } = get();
        if (!audioBlob) {
            toast.error("No audio recorded yet.");
            return;
        }
        set({ isTranscribing: true, transcriptionError: null });
        try {
            const res = await jobApi.transcribeVoice(audioBlob);
            if (res.success && res.data) {
                set((state) => ({
                    draft: { ...state.draft, description: res.data as string },
                    isTranscribing: false,
                    activeTab: "text", // Auto-switch to text tab to show result
                }));
                toast.success("Voice transcribed! You can edit the text below.");
            } else {
                set({ transcriptionError: res.message || "Transcription failed", isTranscribing: false });
            }
        } catch {
            set({ transcriptionError: "An unexpected error occurred during transcription", isTranscribing: false });
        }
    },

    // ── AI Analysis ──────────────────────────
    analyseJob: async () => {
        const { draft } = get();
        if (!draft.description.trim()) {
            toast.error("Please describe the job before analysing.");
            return;
        }
        set({ isAnalysing: true, analysisError: null, aiAnalysis: null });
        try {
            const res = await jobApi.analyseJob(draft.description);
            if (res.success && res.data) {
                const analysis = res.data as AIJobAnalysis;
                set((state) => ({
                    aiAnalysis: analysis,
                    isAnalysing: false,
                    draft: {
                        ...state.draft,
                        category: analysis.detectedCategory,
                        title: state.draft.title || analysis.detectedTitle,
                        budgetMin: analysis.pricingEstimate.min,
                        budgetMax: analysis.pricingEstimate.max,
                    },
                }));
            } else {
                set({ analysisError: res.message || "Analysis failed", isAnalysing: false });
            }
        } catch {
            set({ analysisError: "AI analysis failed. Please try again.", isAnalysing: false });
        }
    },

    // ── Submit ───────────────────────────────
    submitJob: async () => {
        const { draft } = get();
        if (!draft.description.trim()) {
            toast.error("Please describe the job.");
            return false;
        }
        set({ isSubmitting: true, submissionError: null });
        try {
            const res = await jobApi.submitJob(draft);
            if (res.success && res.data) {
                const submitted = res.data as { id: string };
                set({ submittedJobId: submitted.id, isSubmitting: false });
                toast.success("Job posted successfully!");
                return true;
            } else {
                set({ submissionError: res.message || "Submission failed", isSubmitting: false });
                toast.error(res.message || "Job submission failed.");
                return false;
            }
        } catch {
            const msg = "An unexpected error occurred. Please try again.";
            set({ submissionError: msg, isSubmitting: false });
            toast.error(msg);
            return false;
        }
    },

    // ── Utilities ────────────────────────────
    clearErrors: () =>
        set({ transcriptionError: null, analysisError: null, submissionError: null }),
}));

export default useJobPostingStore;
