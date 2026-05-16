import { type ApiResponse } from "./apiUtils";
import { apiPost, apiGet, apiPostRaw } from "./apiClient";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface JobDraft {
    title: string;
    description: string;
    category: string;
    location: string;
    /** Budget in Naira (will be converted to kobo on submit). */
    budget: number;
    voiceAudioUrl?: string;
}

export interface AIRecommendation {
    artisanId: string;
    artisanName: string;
    artisanAvatar: string;
    artisanTitle: string;
    matchScore: number; // 0–100
    estimatedPrice: number;
    estimatedDuration: string;
    reasoning: string;
    suggestedMaterials?: string[];
}

export interface AIPricingEstimate {
    min: number;
    max: number;
    typical: number;
    currency: string;
    breakdown: { label: string; amount: number }[];
}

export interface AIJobAnalysis {
    detectedCategory: string;
    detectedTitle: string;
    confidence: number;
    pricingEstimate: AIPricingEstimate;
    recommendedArtisans: AIRecommendation[];
    suggestedMaterials?: string[];
    tags: string[];
}

export interface SubmittedJob {
    id: string;
    title: string;
    category: string;
    status: string;
    createdAt: string;
    squadVirtualAccount?: string;
    budgetKobo?: number;
}

// ─────────────────────────────────────────────
// Mock Fallbacks (for endpoints with no backend yet)
// ─────────────────────────────────────────────

const MOCK_AI_ANALYSIS: AIJobAnalysis = {
    detectedCategory: "Carpentry",
    detectedTitle: "Custom Wooden Bookshelf",
    confidence: 94,
    pricingEstimate: {
        min: 45000,
        max: 120000,
        typical: 75000,
        currency: "NGN",
        breakdown: [
            { label: "Labour", amount: 40000 },
            { label: "Timber & Wood", amount: 25000 },
            { label: "Polish & Finishing", amount: 10000 },
        ],
    },
    recommendedArtisans: [
        {
            artisanId: "art1",
            artisanName: "Tunde Adeyemi",
            artisanAvatar: "https://i.pravatar.cc/150?u=tunde",
            artisanTitle: "Master Carpenter",
            matchScore: 98,
            estimatedPrice: 75000,
            estimatedDuration: "3–5 days",
            reasoning: "Expert in custom furniture. 142 similar jobs. 0 disputes.",
            suggestedMaterials: ["Hardwood Timber", "Wood Polish", "Sandpaper"],
        },
        {
            artisanId: "art3",
            artisanName: "Ibrahim Musa",
            artisanAvatar: "https://i.pravatar.cc/150?u=ibrahim",
            artisanTitle: "Furniture Specialist",
            matchScore: 87,
            estimatedPrice: 65000,
            estimatedDuration: "4–6 days",
            reasoning: "Great value. 56 reviews. Highly recommended in your area.",
        },
    ],
    suggestedMaterials: ["Hardwood Timber", "Wood Glue", "Nails", "Sandpaper", "Wood Polish"],
    tags: ["Carpentry", "Furniture", "Custom", "Wood"],
};

// ─────────────────────────────────────────────
// Job API Service
// ─────────────────────────────────────────────

export const jobApi = {
    /**
     * Transcribe voice audio using the real backend AI endpoint.
     * POST /ai/transcribe — Content-Type: audio/*
     * Returns the transcribed text string.
     */
    transcribeVoice: async (audioBlob: Blob): Promise<ApiResponse<string>> => {
        try {
            const contentType = audioBlob.type || "audio/webm";
            const res = await apiPostRaw<{ text?: string; transcription?: string }>(
                "/ai/transcribe",
                audioBlob,
                contentType
            );

            if (res.success && res.data) {
                // Normalise backend response — could be { text } or { transcription }
                const text = res.data.text ?? res.data.transcription ?? "";
                if (!text.trim()) {
                    return { data: null, success: false, message: "Transcription returned empty. Please try again." };
                }
                return { data: text, success: true };
            }

            return {
                data: null,
                success: false,
                message: res.message || "Transcription failed. Please try again or type manually.",
            };
        } catch (err: any) {
            return {
                data: null,
                success: false,
                message: err?.message || "Network error during transcription.",
            };
        }
    },

    /**
     * Create a job directly from a voice recording.
     */
    voiceCreateJob: async (audioBlob: Blob, clientId: string): Promise<ApiResponse<SubmittedJob>> => {
        try {
            const contentType = audioBlob.type || "audio/webm";
            const res = await apiPostRaw<any>(
                "/jobs/voice",
                audioBlob,
                contentType,
                { client_id: clientId }
            );

            if (res.success && res.data) {
                const job: SubmittedJob = {
                    id: res.data.id,
                    title: res.data.title || "Voice Job",
                    category: res.data.category || "",
                    status: res.data.status || "pending",
                    createdAt: res.data.createdAt || new Date().toISOString(),
                    squadVirtualAccount: res.data.squadVirtualAccount,
                    budgetKobo: res.data.budgetKobo,
                };

                // Save to session storage for mock persistence
                const storedJobs = JSON.parse(sessionStorage.getItem("conance_mock_jobs") || "[]");
                sessionStorage.setItem("conance_mock_jobs", JSON.stringify([job, ...storedJobs]));

                return { data: job, success: true };
            }

            return {
                data: null,
                success: false,
                message: res.message || "Failed to create job from voice.",
            };
        } catch (err: any) {
            return {
                data: null,
                success: false,
                message: err?.message || "Network error during voice job creation.",
            };
        }
    },

    /**
     * Analyse a job description using AI (mock — no dedicated backend endpoint).
     */
    analyseJob: async (_description: string): Promise<ApiResponse<AIJobAnalysis>> => {
        await new Promise((r) => setTimeout(r, 1800));
        return { data: MOCK_AI_ANALYSIS, success: true, message: "Analysis complete" };
    },

    /**
     * Fetch AI-recommended artisans for a posted job.
     */
    fetchRecommendations: async (jobId: string): Promise<ApiResponse<AIRecommendation[]>> => {
        try {
            const res = await apiGet<any[]>(`/jobs/${jobId}/recommendations`);
            if (res.success && res.data) {
                const artisans: AIRecommendation[] = res.data.map((a: any) => ({
                    artisanId: a.artisanId ?? a.id,
                    artisanName: a.artisanName ?? a.name,
                    artisanAvatar: a.artisanAvatar ?? a.avatar ?? `https://i.pravatar.cc/150?u=${a.id}`,
                    artisanTitle: a.artisanTitle ?? a.title ?? "",
                    matchScore: a.matchScore ?? a.score ?? 0,
                    estimatedPrice: a.estimatedPrice ?? a.priceKobo ? (a.priceKobo / 100) : 0,
                    estimatedDuration: a.estimatedDuration ?? "",
                    reasoning: a.reasoning ?? "",
                    suggestedMaterials: a.suggestedMaterials,
                }));
                return { data: artisans, success: true };
            }
            return { data: MOCK_AI_ANALYSIS.recommendedArtisans, success: true };
        } catch {
            return { data: MOCK_AI_ANALYSIS.recommendedArtisans, success: true };
        }
    },

    /**
     * @deprecated — use fetchRecommendations(jobId) for real data.
     */
    fetchRecommendedArtisans: async (_jobId: string): Promise<ApiResponse<AIRecommendation[]>> => {
        await new Promise((r) => setTimeout(r, 800));
        return { data: MOCK_AI_ANALYSIS.recommendedArtisans, success: true };
    },

    /**
     * Get price estimate for a category/description (mock — no backend endpoint).
     */
    getPriceEstimate: async (_category: string): Promise<ApiResponse<AIPricingEstimate>> => {
        await new Promise((r) => setTimeout(r, 800));
        return { data: MOCK_AI_ANALYSIS.pricingEstimate, success: true };
    },

    /**
     * Submit a text-based job.
     */
    submitJob: async (draft: JobDraft, clientId: string): Promise<ApiResponse<SubmittedJob>> => {
        try {
            const payload = {
                clientId,
                title: draft.title || draft.description.slice(0, 60) || "Untitled Job",
                description: draft.description,
                category: draft.category || "Other",
                budgetKobo: Math.round((draft.budget || 0) * 100),
            };

            const res = await apiPost<any>("/jobs", payload);

            if (res.success && res.data) {
                const job: SubmittedJob = {
                    id: res.data.id,
                    title: res.data.title,
                    category: res.data.category,
                    status: res.data.status || "pending",
                    createdAt: res.data.createdAt || new Date().toISOString(),
                    squadVirtualAccount: res.data.squadVirtualAccount,
                    budgetKobo: res.data.budgetKobo,
                };

                // Save to session storage for mock persistence
                const storedJobs = JSON.parse(sessionStorage.getItem("conance_mock_jobs") || "[]");
                sessionStorage.setItem("conance_mock_jobs", JSON.stringify([job, ...storedJobs]));

                return { data: job, success: true, message: "Job posted successfully!" };
            }

            return { data: null, success: false, message: res.message || "Job submission failed." };
        } catch (err: any) {
            return { data: null, success: false, message: err?.message || "Job submission failed." };
        }
    },

    /**
     * Fetch all jobs for a specific client.
     */
    getClientJobs: async (clientId: string): Promise<ApiResponse<any[]>> => {
        const getMergedData = async () => {
            const { MOCK_CLIENT_JOBS } = await import("@/lib/utils/mockData");
            const storedJobs = JSON.parse(sessionStorage.getItem("conance_mock_jobs") || "[]");
            // Basic mapping to match UI expectations for ClientJob
            const mappedStored = storedJobs.map((j: any) => ({
                id: j.id,
                title: j.title,
                status: j.status || "pending",
                totalPrice: j.budgetKobo ? j.budgetKobo / 100 : 0,
                createdAt: j.createdAt,
                squadVirtualAccount: j.squadVirtualAccount,
                budgetKobo: j.budgetKobo,
                category: j.category,
                // Mock other required fields
                description: "Description not available",
                artisanName: "",
                artisanAvatar: "",
                progress: 0,
                releasedAmount: 0,
                milestones: [],
                location: "Location not set"
            }));
            
            // Avoid duplicates if id exists
            const existingIds = new Set(MOCK_CLIENT_JOBS.map(m => m.id));
            const uniqueStored = mappedStored.filter((j: any) => !existingIds.has(j.id));
            
            return [...uniqueStored, ...MOCK_CLIENT_JOBS];
        };

        try {
            const res = await apiGet<any[]>(`/jobs?client_id=${clientId}`);
            if (res.success && res.data) {
                // If the backend suddenly starts returning jobs, we can use them directly
                return res;
            }
            
            const merged = await getMergedData();
            return { data: merged, success: true };
        } catch {
            const merged = await getMergedData();
            return { data: merged, success: true };
        }
    },
};

