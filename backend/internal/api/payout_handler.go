package api

import (
	"encoding/json"
	"net/http"

	"github.com/conance/backend/internal/payment"
)

type PayoutHandler struct {
	squad *payment.SquadClient
}

func NewPayoutHandler(squad *payment.SquadClient) *PayoutHandler {
	return &PayoutHandler{squad: squad}
}

type AccountLookupRequest struct {
	BankCode      string `json:"bank_code"`
	AccountNumber string `json:"account_number"`
}

func (h *PayoutHandler) AccountLookup(w http.ResponseWriter, r *http.Request) {
	var req AccountLookupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := h.squad.AccountLookup(r.Context(), payment.AccountLookupRequest{
		BankCode:      req.BankCode,
		AccountNumber: req.AccountNumber,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}

