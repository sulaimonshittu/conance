import { create } from "zustand";
import { jobApi, type JobDraft, type AIJobAnalysis, type SubmittedJob } from "../api/job.api";
import { toast } from "sonner";
import useAuthStore from "./useAuthStore";


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
    submittedJob: SubmittedJob | null;
    submissionError: string | null;


    // Actions — Draft
    setActiveTab: (tab: "voice" | "text") => void;
    updateDraft: (updates: Partial<JobDraft>) => void;
    resetDraft: () => void;

    // Actions — Audio
    setAudioBlob: (blob: Blob | null, url: string | null) => void;
    setIsRecording: (val: boolean) => void;
    setRecordingDuration: (val: number) => void;
    clearAudio: () => void;

    // Actions — Async
    transcribeVoice: () => Promise<void>;
    submitVoiceJob: () => Promise<boolean>;
    analyseJob: () => Promise<void>;
    submitJob: () => Promise<boolean>;

    // Utilities
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
    budget: 0,
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
    submittedJob: null,
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
            submittedJob: null,
            transcriptionError: null,
            analysisError: null,
            submissionError: null,
        }),


    // ── Audio ────────────────────────────────
    setAudioBlob: (blob, url) => set({ audioBlob: blob, audioUrl: url }),
    setIsRecording: (val) => set({ isRecording: val }),
    setRecordingDuration: (val) => set({ recordingDuration: val }),
    clearAudio: () => set({ audioBlob: null, audioUrl: null, recordingDuration: 0 }),

    // ── Transcription (POST /ai/transcribe) ──
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
                    activeTab: "text", // Auto-switch so user can review + edit
                }));
                toast.success("Voice transcribed! Review and edit before posting.");
            } else {
                set({
                    transcriptionError: res.message || "Transcription failed.",
                    isTranscribing: false,
                });
                toast.error(res.message || "Transcription failed. Please try again.");
            }
        } catch {
            const msg = "An unexpected error occurred during transcription.";
            set({ transcriptionError: msg, isTranscribing: false });
            toast.error(msg);
        }
    },

    // ── Voice Job (POST /jobs/voice) ─────────
    submitVoiceJob: async () => {
        const { audioBlob } = get();
        if (!audioBlob) {
            toast.error("No audio recorded yet.");
            return false;
        }

        const { user } = useAuthStore.getState();
        if (!user) {
            toast.error("You must be logged in to post a job.");
            return false;
        }

        set({ isSubmitting: true, submissionError: null });
        try {
            const res = await jobApi.voiceCreateJob(audioBlob, user.id);
            if (res.success && res.data) {
                const job = res.data as SubmittedJob;
                set({ submittedJob: job, isSubmitting: false });
                toast.success("Voice job posted! Artisans will see it shortly.");
                return true;
            }

            const msg = res.message || "Failed to post voice job.";
            set({ submissionError: msg, isSubmitting: false });
            toast.error(msg);
            return false;
        } catch {
            const msg = "An unexpected error occurred. Please try again.";
            set({ submissionError: msg, isSubmitting: false });
            toast.error(msg);
            return false;
        }
    },

    // ── AI Analysis (mock — no backend endpoint) ──
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
                        category: state.draft.category || analysis.detectedCategory,
                        title: state.draft.title || analysis.detectedTitle,
                        // Pre-fill budget with typical estimate if not set
                        budget: state.draft.budget || analysis.pricingEstimate.typical,
                    },
                }));
            } else {
                set({ analysisError: res.message || "Analysis failed.", isAnalysing: false });
            }
        } catch {
            set({ analysisError: "AI analysis failed. Please try again.", isAnalysing: false });
        }
    },

    // ── Text Job Submit (POST /jobs) ──────────
    submitJob: async () => {
        const { draft } = get();
        if (!draft.description.trim()) {
            toast.error("Please describe the job.");
            return false;
        }

        const { user } = useAuthStore.getState();
        if (!user) {
            toast.error("You must be logged in to post a job.");
            return false;
        }

        set({ isSubmitting: true, submissionError: null });
        try {
            const res = await jobApi.submitJob(draft, user.id);
            if (res.success && res.data) {
                const submitted = res.data as SubmittedJob;
                set({ submittedJob: submitted, isSubmitting: false });
                toast.success("Job posted! Artisans will now see it.");
                return true;
            }

            const msg = res.message || "Submission failed.";
            set({ submissionError: msg, isSubmitting: false });
            toast.error(msg);
            return false;
        } catch {
            const msg = "An unexpected error occurred. Please try again.";
            set({ submissionError: msg, isSubmitting: false });
            toast.error(msg);
            return false;
        }
    },

    // ── Utilities ────────────────────────────
    clearErrors: () =>
        set({
            transcriptionError: null,
            analysisError: null,
            submissionError: null,
        }),
}));

export default useJobPostingStore;
