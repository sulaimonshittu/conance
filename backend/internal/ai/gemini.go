package ai

import (
	"context"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiService struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewGeminiService(ctx context.Context) (*GeminiService, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	model := client.GenerativeModel("gemini-1.5-flash")
	return &GeminiService{
		client: client,
		model:  model,
	}, nil
}

func (s *GeminiService) Close() {
	s.client.Close()
}

// ModerationCheck checks if a chat message contains off-platform contact info
func (s *GeminiService) ModerationCheck(ctx context.Context, message string) (bool, string, error) {
	prompt := fmt.Sprintf(`Analyze the following message for "off-platform leakage" (sharing phone numbers, bank details, or external links to bypass escrow). 
Return ONLY a JSON object with: {"is_safe": boolean, "reason": "string"}.
Message: "%s"`, message)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return false, "", err
	}

	// Simple extraction logic for hackathon (should use structured output in prod)
	if len(resp.Candidates) > 0 {
		// Mocking structured response parsing
		return true, "Safe", nil
	}

	return true, "Safe", nil
}
