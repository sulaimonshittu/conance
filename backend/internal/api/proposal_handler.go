package api

import (
	"encoding/json"
	"net/http"

	"github.com/conance/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ProposalHandler struct {
	svc *service.ProposalService
}

func NewProposalHandler(svc *service.ProposalService) *ProposalHandler {
	return &ProposalHandler{svc: svc}
}

type SubmitProposalRequest struct {
	ArtisanID  string `json:"artisan_id"`
	PriceKobo  int64  `json:"price_kobo"`
	ETAMinutes int    `json:"eta_minutes"`
	Message    string `json:"message"`
}

func (h *ProposalHandler) SubmitProposal(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	var req SubmitProposalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	artisanID, err := uuid.Parse(req.ArtisanID)
	if err != nil {
		http.Error(w, "invalid artisan_id", http.StatusBadRequest)
		return
	}

	p, err := h.svc.SubmitProposal(r.Context(), jobID, artisanID, req.PriceKobo, req.ETAMinutes, req.Message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(p)
}

func (h *ProposalHandler) ListProposals(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	out, err := h.svc.ListProposals(r.Context(), jobID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(out)
}

type AcceptProposalRequest struct {
	ClientID string `json:"client_id"`
}

func (h *ProposalHandler) AcceptProposal(w http.ResponseWriter, r *http.Request) {
	proposalIDStr := chi.URLParam(r, "id")
	proposalID, err := uuid.Parse(proposalIDStr)
	if err != nil {
		http.Error(w, "invalid proposal_id", http.StatusBadRequest)
		return
	}

	var req AcceptProposalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	clientID, err := uuid.Parse(req.ClientID)
	if err != nil {
		http.Error(w, "invalid client_id", http.StatusBadRequest)
		return
	}

	if err := h.svc.AcceptProposal(r.Context(), proposalID, clientID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status":"accepted"}`))
}

