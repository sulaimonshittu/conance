package ai

import (
	"context"
	"fmt"

	"github.com/google/generative-ai-go/genai"
)

// TranscribeVoiceNote uses Gemini to convert artisan voice notes into text (STT)
// This supports artisans like "Mama Chika" who prefer speaking over typing.
func (s *GeminiService) TranscribeVoiceNote(ctx context.Context, audioData []byte, mimeType string) (string, error) {
	prompt := "Transcribe this voice note accurately. If it's in Nigerian Pidgin or a local dialect, translate it to clear English while preserving the intent."

	// Create a blob part for the audio
	audioPart := genai.Blob{
		MIMEType: mimeType, // e.g., "audio/mp3", "audio/wav", "audio/ogg"
		Data:     audioData,
	}

	resp, err := s.model.GenerateContent(ctx, audioPart, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to transcribe voice note: %w", err)
	}

	if len(resp.Candidates) > 0 {
		var transcription string
		for _, part := range resp.Candidates[0].Content.Parts {
			transcription += fmt.Sprintf("%v", part)
		}
		return transcription, nil
	}

	return "", fmt.Errorf("no transcription generated")
}
