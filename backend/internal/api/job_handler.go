package api

import (
	"encoding/json"
	"net/http"

	"github.com/conance/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type JobHandler struct {
	escrowService *service.EscrowService
	jobService    *service.JobService
}

func NewJobHandler(es *service.EscrowService, js *service.JobService) *JobHandler {
	return &JobHandler{escrowService: es, jobService: js}
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
	jobID, _ := uuid.Parse(jobIDStr)

	var req SubmitWorkRequest
	json.NewDecoder(r.Body).Decode(&req)
	artisanID, _ := uuid.Parse(req.ArtisanID)

	err := h.jobService.SubmitWork(r.Context(), jobID, artisanID, req.Photos, req.Note)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"submitted"}`))
}

func (h *JobHandler) ReleaseFunds(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, _ := uuid.Parse(jobIDStr)

	err := h.jobService.ReleaseFunds(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"status":"released"}`))
}
