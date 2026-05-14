package ai

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
)

func (s *GeminiService) DraftProposal(ctx context.Context, jobTitle, jobDesc, artisanBio string, priceKobo int64, etaMinutes int) (string, error) {
	prompt := fmt.Sprintf(`Write a short, professional proposal an artisan can send to a client in Nigeria.

Job title: %s
Job description: %s

Artisan bio: %s
Price (kobo): %d
ETA (minutes): %d

Return only the proposal text.`, jobTitle, jobDesc, artisanBio, priceKobo, etaMinutes)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}
	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return "", fmt.Errorf("no proposal generated")
	}

	var out strings.Builder
	for _, part := range resp.Candidates[0].Content.Parts {
		out.WriteString(fmt.Sprintf("%v", part))
	}
	return strings.TrimSpace(out.String()), nil
}

func (s *GeminiService) MediateDispute(ctx context.Context, reason string, amountKobo int64) (string, error) {
	prompt := fmt.Sprintf(`You are an escrow dispute mediator for a Nigerian artisan marketplace.
Reason: %s
Escrow amount (kobo): %d

Suggest a fair split (client_refund_kobo, artisan_payout_kobo) and briefly explain.
Return ONLY JSON: {"client_refund_kobo": number, "artisan_payout_kobo": number, "reason": "string"}.`, reason, amountKobo)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}
	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return "", fmt.Errorf("no mediation suggestion generated")
	}

	var out strings.Builder
	for _, part := range resp.Candidates[0].Content.Parts {
		out.WriteString(fmt.Sprintf("%v", part))
	}
	return strings.TrimSpace(out.String()), nil
}
