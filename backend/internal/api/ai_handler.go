package api

import (
	"io"
	"net/http"

	"github.com/conance/backend/internal/ai"
)

type AIHandler struct {
	gemini *ai.GeminiService
}

func NewAIHandler(g *ai.GeminiService) *AIHandler {
	return &AIHandler{gemini: g}
}

func (h *AIHandler) TranscribeVoice(w http.ResponseWriter, r *http.Request) {
	// In a real app, use multipart/form-data to get the file
	audioData, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "failed to read audio data", http.StatusBadRequest)
		return
	}

	mimeType := r.Header.Get("Content-Type")
	if mimeType == "" {
		mimeType = "audio/mp3" // Default
	}

	text, err := h.gemini.TranscribeVoiceNote(r.Context(), audioData, mimeType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte(text))
}
