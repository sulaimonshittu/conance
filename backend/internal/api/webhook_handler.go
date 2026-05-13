package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/conance/backend/internal/service"
)

type WebhookHandler struct {
	escrowService *service.EscrowService
}

func NewWebhookHandler(es *service.EscrowService) *WebhookHandler {
	return &WebhookHandler{escrowService: es}
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

	// Squad sends NGN amounts in Kobo if specified, or check documentation
	// For sandbox, we'll assume it matches our BIGINT kobo standard
	if payload.Event == "virtual_account_deposit" {
		err := h.escrowService.HandleFunded(r.Context(), payload.Data.VirtualAccountNumber, payload.Data.Amount)
		if err != nil {
			fmt.Printf("Webhook error: %v\n", err)
			http.Error(w, "failed to process funding", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success"}`))
}
