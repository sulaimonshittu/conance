package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/conance/backend/internal/repository"
	"github.com/conance/backend/internal/service"
)

type WebhookHandler struct {
	escrowService *service.EscrowService
	webhooks      *repository.WebhookRepository
}

func NewWebhookHandler(es *service.EscrowService, wr *repository.WebhookRepository) *WebhookHandler {
	return &WebhookHandler{escrowService: es, webhooks: wr}
}

type SquadWebhookPayload struct {
	Event string `json:"event"`
	Data  struct {
		VirtualAccountNumber string `json:"virtual_account_number"`
		Amount               int64  `json:"amount"`
		TransactionReference string `json:"transaction_reference"`
	} `json:"data"`
}

func (h *WebhookHandler) HandleSquad(w http.ResponseWriter, r *http.Request) {
	var payload SquadWebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	raw, _ := json.Marshal(payload)
	eventID := payload.Data.TransactionReference
	if eventID == "" {
		eventID = payload.Data.VirtualAccountNumber
	}

	isNew, err := h.webhooks.InsertIfNew(r.Context(), "squad", eventID, payload.Event, raw, false)
	if err != nil {
		http.Error(w, "failed to record webhook", http.StatusInternalServerError)
		return
	}
	if !isNew {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"duplicate_ignored"}`))
		return
	}

	if payload.Event == "virtual_account_deposit" {
		err := h.escrowService.HandleFunded(r.Context(), payload.Data.VirtualAccountNumber, payload.Data.Amount)
		if err != nil {
			fmt.Printf("Webhook error: %v\n", err)
			http.Error(w, "failed to process funding", http.StatusInternalServerError)
			return
		}
	}

	_ = h.webhooks.MarkProcessed(r.Context(), "squad", eventID)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success"}`))
}
