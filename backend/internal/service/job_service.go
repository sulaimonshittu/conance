package service

import (
	"context"
	"fmt"

	"github.com/conance/backend/internal/ai"
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
	// 1. Create submission record
	subID, err := s.repo.CreateSubmission(ctx, jobID, artisanID, photos, note)
	if err != nil {
		return err
	}

	// 2. Update job status to 'submitted'
	if err := s.repo.UpdateStatus(ctx, jobID, string(StatusSubmitted)); err != nil {
		return err
	}

	// 3. Async AI Verification (In a real app, this would be a background task via Asynq)
	// For the hackathon, we'll do it synchronously or mock it
	job, _ := s.repo.GetByID(ctx, jobID)
	// Assuming first photo for verification
	verified, feedback, err := s.gemini.VerifyWorkSubmission(ctx, job.Description, []byte("mock_photo_data"))
	
	status := "flagged"
	if verified {
		status = "verified"
	}
	
	return s.repo.UpdateSubmissionAIStatus(ctx, subID, status, feedback)
}

func (s *JobService) ReleaseFunds(ctx context.Context, jobID uuid.UUID) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
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
	
	return s.repo.CreateLedgerEntry(ctx, jobID, job.BudgetKobo, "credit", "artisan_wallet", "Payment received for job completion")
}
