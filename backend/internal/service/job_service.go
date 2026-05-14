package service

import (
	"context"
	"fmt"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type JobService struct {
	repo     *repository.JobRepository
	userRepo *repository.UserRepository
	gemini   *ai.GeminiService
}

func NewJobService(repo *repository.JobRepository, userRepo *repository.UserRepository, gemini *ai.GeminiService) *JobService {
	return &JobService{repo: repo, userRepo: userRepo, gemini: gemini}
}

func (s *JobService) RecommendArtisans(ctx context.Context, jobID uuid.UUID) (string, error) {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return "", err
	}

	artisans, err := s.repo.GetArtisansByCategory(ctx, job.Category)
	if err != nil {
		return "", err
	}

	return s.gemini.MatchArtisans(ctx, job.Title, job.Description, artisans)
}

func (s *JobService) RecommendJobsForArtisan(ctx context.Context, artisanID uuid.UUID) (string, error) {
	profile, err := s.userRepo.GetArtisanProfile(ctx, artisanID)
	if err != nil {
		return "", err
	}

	jobs, err := s.repo.GetJobsByCategory(ctx, profile.Category)
	if err != nil {
		return "", err
	}

	return s.gemini.MatchJobsForArtisan(ctx, profile.Category, profile.Bio, jobs)
}

func (s *JobService) SubmitWork(ctx context.Context, jobID, artisanID uuid.UUID, photos []string, note string) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}
	if job.ArtisanID == nil || *job.ArtisanID != artisanID {
		return fmt.Errorf("artisan not assigned to job")
	}
	if job.Status != string(StatusInProgress) {
		return fmt.Errorf("job must be in_progress to submit; current: %s", job.Status)
	}

	subID, err := s.repo.CreateSubmission(ctx, jobID, artisanID, photos, note)
	if err != nil {
		return err
	}

	if err := s.repo.UpdateStatus(ctx, jobID, string(StatusSubmitted)); err != nil {
		return err
	}

	verified, feedback, err := s.gemini.VerifyWorkSubmission(ctx, job.Description, []byte("mock_photo_data"))
	if err != nil {
		return err
	}
	
	status := "flagged"
	if verified {
		status = "verified"
	}
	
	return s.repo.UpdateSubmissionAIStatus(ctx, subID, status, feedback)
}

func (s *JobService) ReleaseFunds(ctx context.Context, jobID uuid.UUID, clientID uuid.UUID) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}
	if job.ClientID != clientID {
		return fmt.Errorf("client does not own job")
	}

	if job.Status != string(StatusSubmitted) {
		return fmt.Errorf("job cannot be released from state: %s", job.Status)
	}

	// 1. Update job status
	if err := s.repo.UpdateStatus(ctx, jobID, string(StatusReleased)); err != nil {
		return err
	}

	// 2. Move funds in ledger (Escrow -> Artisan Wallet)
	if err := s.repo.CreateLedgerEntry(ctx, jobID, job.BudgetKobo, "debit", "escrow", "Funds released by client"); err != nil {
		return err
	}
	
	if err := s.repo.CreateLedgerEntry(ctx, jobID, job.BudgetKobo, "credit", "artisan_wallet", "Payment received for job completion"); err != nil {
		return err
	}

	if job.ArtisanID != nil {
		components := map[string]any{
			"completed_job": true,
			"disputed":      false,
		}
		newScore := 50
		if job.ArtisanID != nil {
			newScore = 55
		}
		_ = s.userRepo.UpdateTrustScore(ctx, *job.ArtisanID, newScore, components)
	}

	return s.repo.UpdateStatus(ctx, jobID, string(StatusSettled))
}
