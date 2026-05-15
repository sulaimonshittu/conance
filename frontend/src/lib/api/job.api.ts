import { mockResponse, delay, type ApiResponse } from "./apiUtils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface JobDraft {
    title: string;
    description: string;
    category: string;
    location: string;
    budgetMin: number;
    budgetMax: number;
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
    status: "pending" | "analysing" | "matched" | "posted";
    createdAt: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const MOCK_AI_RESPONSE: AIJobAnalysis = {
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
     * Transcribe voice audio to text.
     * Replace with real STT API (e.g., Whisper, Google STT).
     */
    transcribeVoice: async (_audioBlob: Blob) => {
        await delay(2500); // Simulate STT processing time
        
        const possibleTranscriptions = [
            "I need a custom wooden bookshelf for my living room. It should be about 6 feet tall with 5 shelves. I want it made of good quality hardwood and polished nicely.",
            "I'm looking for a plumber to fix a leaking pipe in my kitchen. It's been dripping for two days and starting to pool under the sink. Need someone who can come today.",
            "Can someone help me paint my three-bedroom apartment? I have the paint already, just need a professional to do the walls and ceilings carefully.",
            "I need an electrician to install some new outdoor lighting and check the circuit breaker. Some of the switches in the hallway are flickering."
        ];

        // Simulate rare failure (10%)
        if (Math.random() < 0.1) {
            return mockResponse(
                null,
                false,
                "Speech recognition failed. Please try again or type manually.",
                0
            );
        }

        const randomText = possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)];
        
        return mockResponse(
            randomText,
            true,
            "Transcription successful",
            0
        );
    },

    /**
     * Analyse a submitted job description using AI.
     * Replace with real AI endpoint.
     */
    analyseJob: async (_description: string): Promise<ApiResponse<AIJobAnalysis>> => {
        await delay(3000); // Simulate AI analysis time
        return mockResponse(MOCK_AI_RESPONSE, true, "Analysis complete", 0);
    },

    /**
     * Fetch AI-recommended artisans for a job.
     * Replace with real endpoint.
     */
    fetchRecommendedArtisans: async (_jobId: string) => {
        await delay(1200);
        return mockResponse(MOCK_AI_RESPONSE.recommendedArtisans, true, "Artisans fetched", 0);
    },

    /**
     * Get price estimate for a category/description.
     */
    getPriceEstimate: async (_category: string) => {
        await delay(1000);
        return mockResponse(MOCK_AI_RESPONSE.pricingEstimate, true, "Price estimate ready", 0);
    },

    /**
     * Submit a final job for posting.
     * Replace with real POST /jobs endpoint.
     */
    submitJob: async (draft: JobDraft): Promise<ApiResponse<SubmittedJob>> => {
        await delay(2000);
        // Simulate 5% failure
        if (Math.random() < 0.05) {
            return mockResponse<SubmittedJob>(null, false, "Job submission failed. Please try again.", 0);
        }
        const job: SubmittedJob = {
            id: `job_${Date.now()}`,
            title: draft.title || "Untitled Job",
            category: draft.category,
            status: "analysing",
            createdAt: new Date().toISOString(),
        };
        return mockResponse(job, true, "Job posted successfully!", 0);
    },
};
