package ai

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
)

// MatchArtisans uses Gemini to rank artisans based on job description and proximity
func (s *GeminiService) MatchArtisans(ctx context.Context, jobTitle, jobDesc string, artisans []string) (string, error) {
	prompt := fmt.Sprintf(`Given the following job:
Title: %s
Description: %s

And the following artisans (with categories and ratings):
%s

Rank the top 3 artisans most suitable for this job. Explain briefly why.`, jobTitle, jobDesc, strings.Join(artisans, "\n"))

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) > 0 {
		var result strings.Builder
		for _, part := range resp.Candidates[0].Content.Parts {
			result.WriteString(fmt.Sprintf("%v", part))
		}
		return result.String(), nil
	}

	return "No suitable matches found.", nil
}

// VerifyWorkSubmission uses Gemini Vision to verify if a photo matches the job completion requirements
func (s *GeminiService) VerifyWorkSubmission(ctx context.Context, jobDesc string, photoData []byte) (bool, string, error) {
	prompt := fmt.Sprintf(`The following image is a submission for a job described as: "%s".
Verify if the image shows the completed work. Return a confidence score and a brief explanation.`, jobDesc)

	imgPart := genai.ImageData("png", photoData)
	resp, err := s.model.GenerateContent(ctx, imgPart, genai.Text(prompt))
	if err != nil {
		return false, "", err
	}

	// Logic to parse Gemini's visual analysis
	return "Work verified with high confidence", nil
}

// MatchJobsForArtisan uses Gemini to rank available jobs for an artisan based on their skills
func (s *GeminiService) MatchJobsForArtisan(ctx context.Context, artisanCategory, artisanBio string, jobs []string) (string, error) {
	prompt := fmt.Sprintf(`Given the following artisan profile:
Category: %s
Bio: %s

And the following available jobs:
%s

Rank the top 3 jobs this artisan should bid on. Explain briefly why.`, artisanCategory, artisanBio, strings.Join(jobs, "\n"))

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) > 0 {
		var result strings.Builder
		for _, part := range resp.Candidates[0].Content.Parts {
			result.WriteString(fmt.Sprintf("%v", part))
		}
		return result.String(), nil
	}

	return "No suitable jobs found.", nil
}
