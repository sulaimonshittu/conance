package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
)

type JobIntent struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	BudgetKobo  int64  `json:"budget_kobo"`
}

func (s *GeminiService) ExtractJobIntent(ctx context.Context, transcript string) (*JobIntent, error) {
	prompt := fmt.Sprintf(`Extract a job post from the following transcript (Nigeria context). Return ONLY JSON:
{"title":"string","description":"string","category":"string","budget_kobo":number}

Transcript:
%s`, transcript)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, err
	}
	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return nil, fmt.Errorf("no intent extracted")
	}

	var out strings.Builder
	for _, part := range resp.Candidates[0].Content.Parts {
		out.WriteString(fmt.Sprintf("%v", part))
	}
	raw := strings.TrimSpace(out.String())

	var intent JobIntent
	if err := json.Unmarshal([]byte(raw), &intent); err != nil {
		start := strings.IndexByte(raw, '{')
		end := strings.LastIndexByte(raw, '}')
		if start >= 0 && end > start {
			if err2 := json.Unmarshal([]byte(raw[start:end+1]), &intent); err2 != nil {
				return nil, err
			}
		} else {
			return nil, err
		}
	}

	if intent.Title == "" {
		intent.Title = "Job request"
	}
	if intent.Description == "" {
		intent.Description = transcript
	}
	if intent.Category == "" {
		intent.Category = "General"
	}
	if intent.BudgetKobo <= 0 {
		intent.BudgetKobo = 100000
	}

	return &intent, nil
}

