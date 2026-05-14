package api

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type JobHandler struct {
	escrowService *service.EscrowService
	jobService    *service.JobService
	gemini        *ai.GeminiService
}

func NewJobHandler(es *service.EscrowService, js *service.JobService, gemini *ai.GeminiService) *JobHandler {
	return &JobHandler{escrowService: es, jobService: js, gemini: gemini}
}

type CreateJobRequest struct {
	ClientID    string `json:"client_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	BudgetKobo  int64  `json:"budget_kobo"`
}

func (h *JobHandler) CreateJob(w http.ResponseWriter, r *http.Request) {
	var req CreateJobRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	clientUUID, err := uuid.Parse(req.ClientID)
	if err != nil {
		http.Error(w, "invalid client_id", http.StatusBadRequest)
		return
	}

	job, err := h.escrowService.PostJob(r.Context(), clientUUID, req.Title, req.Description, req.Category, req.BudgetKobo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(job)
}

func (h *JobHandler) CreateJobFromVoice(w http.ResponseWriter, r *http.Request) {
	clientIDStr := r.URL.Query().Get("client_id")
	clientID, err := uuid.Parse(clientIDStr)
	if err != nil {
		http.Error(w, "invalid client_id", http.StatusBadRequest)
		return
	}

	audioData, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "failed to read audio", http.StatusBadRequest)
		return
	}
	mimeType := r.Header.Get("Content-Type")
	if mimeType == "" {
		mimeType = "audio/mp3"
	}

	transcript, err := h.gemini.TranscribeVoiceNote(r.Context(), audioData, mimeType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	intent, err := h.gemini.ExtractJobIntent(r.Context(), transcript)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	job, err := h.escrowService.PostJob(r.Context(), clientID, intent.Title, intent.Description, intent.Category, intent.BudgetKobo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"job":        job,
		"transcript": transcript,
		"intent":     intent,
	})
}

func (h *JobHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	recommendations, err := h.jobService.RecommendArtisans(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"recommendations": recommendations})
}

func (h *JobHandler) GetArtisanRecommendations(w http.ResponseWriter, r *http.Request) {
	artisanIDStr := chi.URLParam(r, "id")
	artisanID, err := uuid.Parse(artisanIDStr)
	if err != nil {
		http.Error(w, "invalid artisan_id", http.StatusBadRequest)
		return
	}

	recommendations, err := h.jobService.RecommendJobsForArtisan(r.Context(), artisanID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"recommendations": recommendations})
}

type SubmitWorkRequest struct {
	ArtisanID string   `json:"artisan_id"`
	Photos    []string `json:"photos"`
	Note      string   `json:"note"`
}

func (h *JobHandler) SubmitWork(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	var req SubmitWorkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	artisanID, err := uuid.Parse(req.ArtisanID)
	if err != nil {
		http.Error(w, "invalid artisan_id", http.StatusBadRequest)
		return
	}

	err = h.jobService.SubmitWork(r.Context(), jobID, artisanID, req.Photos, req.Note)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"submitted"}`))
}

type AssignArtisanRequest struct {
	ArtisanID string `json:"artisan_id"`
}

func (h *JobHandler) AssignArtisan(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}
	var req AssignArtisanRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	artisanID, err := uuid.Parse(req.ArtisanID)
	if err != nil {
		http.Error(w, "invalid artisan_id", http.StatusBadRequest)
		return
	}
	if err := h.escrowService.AssignArtisan(r.Context(), jobID, artisanID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status":"assigned"}`))
}

func (h *JobHandler) MarkInProgress(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}
	if err := h.escrowService.MarkInProgress(r.Context(), jobID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status":"in_progress"}`))
}

func (h *JobHandler) ReleaseFunds(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	var req struct {
		ClientID string `json:"client_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	clientID, err := uuid.Parse(req.ClientID)
	if err != nil {
		http.Error(w, "invalid client_id", http.StatusBadRequest)
		return
	}

	err = h.jobService.ReleaseFunds(r.Context(), jobID, clientID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"released"}`))
}
