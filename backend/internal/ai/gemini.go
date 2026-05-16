package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiService struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func heuristicModeration(message string) (bool, string, bool) {
	msg := strings.TrimSpace(message)
	if msg == "" {
		return true, "empty message", true
	}

	phoneRe := regexp.MustCompile(`(?i)(\+?234|0)\d{9,11}`)
	if phoneRe.MatchString(msg) {
		return false, "phone number detected", true
	}
	linkRe := regexp.MustCompile(`(?i)\b(https?://|www\.|wa\.me/|t\.me/)\S+`)
	if linkRe.MatchString(msg) {
		return false, "external link detected", true
	}
	lower := strings.ToLower(msg)
	if strings.Contains(lower, "instagram") || strings.Contains(lower, "whatsapp") {
		return false, "off-platform channel mentioned", true
	}

	return true, "", false
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

	// gemini-2.5-flash has separate quota from 2.0-flash
	model := client.GenerativeModel("gemini-2.5-flash")
	
	return &GeminiService{
		client: client,
		model:  model,
	}, nil
}

func (s *GeminiService) Close() {
	s.client.Close()
}

func (s *GeminiService) ModerationCheck(ctx context.Context, message string) (bool, string, error) {
	if ok, reason, matched := heuristicModeration(message); matched {
		return ok, reason, nil
	}

	prompt := fmt.Sprintf(`Analyze the following message for "off-platform leakage" (sharing phone numbers, bank details, or external links to bypass escrow). 
Return ONLY a JSON object with: {"is_safe": boolean, "reason": "string"}.
Message: "%s"`, message)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return false, "", err
	}

	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return true, "no model output", nil
	}

	var out strings.Builder
	for _, part := range resp.Candidates[0].Content.Parts {
		out.WriteString(fmt.Sprintf("%v", part))
	}
	raw := strings.TrimSpace(out.String())

	type modResp struct {
		IsSafe bool   `json:"is_safe"`
		Reason string `json:"reason"`
	}

	var parsed modResp
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		if start := strings.IndexByte(raw, '{'); start >= 0 {
			if end := strings.LastIndexByte(raw, '}'); end > start {
				_ = json.Unmarshal([]byte(raw[start:end+1]), &parsed)
			}
		}
	}

	if parsed.Reason == "" {
		parsed.Reason = raw
	}

	return parsed.IsSafe, parsed.Reason, nil
}
