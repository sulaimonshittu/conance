package api

import (
	"encoding/json"
	"net/http"

	"github.com/conance/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type DisputeHandler struct {
	svc *service.DisputeService
}

func NewDisputeHandler(svc *service.DisputeService) *DisputeHandler {
	return &DisputeHandler{svc: svc}
}

type OpenDisputeRequest struct {
	OpenerID string `json:"opener_id"`
	Reason   string `json:"reason"`
}

func (h *DisputeHandler) OpenDispute(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "id")
	jobID, err := uuid.Parse(jobIDStr)
	if err != nil {
		http.Error(w, "invalid job_id", http.StatusBadRequest)
		return
	}

	var req OpenDisputeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	openerID, err := uuid.Parse(req.OpenerID)
	if err != nil {
		http.Error(w, "invalid opener_id", http.StatusBadRequest)
		return
	}

	d, err := h.svc.OpenDispute(r.Context(), jobID, openerID, req.Reason)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(d)
}

type AcceptMediationRequest struct {
	ActorID    string         `json:"actor_id"`
	Resolution map[string]any `json:"resolution"`
}

func (h *DisputeHandler) AcceptMediation(w http.ResponseWriter, r *http.Request) {
	disputeIDStr := chi.URLParam(r, "id")
	disputeID, err := uuid.Parse(disputeIDStr)
	if err != nil {
		http.Error(w, "invalid dispute_id", http.StatusBadRequest)
		return
	}

	var req AcceptMediationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	actorID, err := uuid.Parse(req.ActorID)
	if err != nil {
		http.Error(w, "invalid actor_id", http.StatusBadRequest)
		return
	}

	if err := h.svc.AcceptMediation(r.Context(), disputeID, actorID, req.Resolution); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status":"settled"}`))
}

