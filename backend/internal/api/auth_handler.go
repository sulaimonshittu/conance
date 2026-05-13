package api

import (
	"encoding/json"
	"net/http"

	"github.com/conance/backend/internal/service"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(as *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: as}
}

type OTPRequest struct {
	PhoneNumber string `json:"phone_number"`
}

func (h *AuthHandler) RequestOTP(w http.ResponseWriter, r *http.Request) {
	var req OTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	otp, err := h.authService.RequestOTP(r.Context(), req.PhoneNumber)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// For hackathon, we return the OTP in the response for easy testing
	json.NewEncoder(w).Encode(map[string]string{"message": "OTP sent", "otp": otp})
}

type VerifyOTPRequest struct {
	PhoneNumber string `json:"phone_number"`
	OTP         string `json:"otp"`
}

func (h *AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var req VerifyOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	success, err := h.authService.VerifyOTP(r.Context(), req.PhoneNumber, req.OTP)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if !success {
		http.Error(w, "invalid OTP", http.StatusUnauthorized)
		return
	}

	// In real app, generate JWT here
	json.NewEncoder(w).Encode(map[string]string{"message": "Verified", "token": "mock_jwt_token"})
}
