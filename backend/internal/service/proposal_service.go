package service

import (
	"context"
	"fmt"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type ProposalService struct {
	proposals *repository.ProposalRepository
	jobs      *repository.JobRepository
	users     *repository.UserRepository
	escrow    *EscrowService
	gemini    *ai.GeminiService
}

func NewProposalService(
	proposals *repository.ProposalRepository,
	jobs *repository.JobRepository,
	users *repository.UserRepository,
	escrow *EscrowService,
	gemini *ai.GeminiService,
) *ProposalService {
	return &ProposalService{
		proposals: proposals,
		jobs:      jobs,
		users:     users,
		escrow:    escrow,
		gemini:    gemini,
	}
}

func (s *ProposalService) SubmitProposal(ctx context.Context, jobID, artisanID uuid.UUID, priceKobo int64, etaMinutes int, message string) (*repository.Proposal, error) {
	job, err := s.jobs.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}
	if job.Status != string(StatusPosted) && job.Status != string(StatusFunded) {
		return nil, fmt.Errorf("cannot bid on job in state: %s", job.Status)
	}

	finalMessage := message
	if finalMessage == "" {
		profile, err := s.users.GetArtisanProfile(ctx, artisanID)
		if err != nil {
			return nil, err
		}
		draft, err := s.gemini.DraftProposal(ctx, job.Title, job.Description, profile.Bio, priceKobo, etaMinutes)
		if err != nil {
			return nil, err
		}
		finalMessage = draft
	}

	p := &repository.Proposal{
		ID:         uuid.New(),
		JobID:      jobID,
		ArtisanID:  artisanID,
		PriceKobo:  priceKobo,
		ETAMinutes: etaMinutes,
		Message:    finalMessage,
		Status:     "submitted",
	}

	if err := s.proposals.Create(ctx, p); err != nil {
		return nil, err
	}
	return p, nil
}

func (s *ProposalService) ListProposals(ctx context.Context, jobID uuid.UUID) ([]repository.Proposal, error) {
	return s.proposals.ListByJob(ctx, jobID)
}

func (s *ProposalService) AcceptProposal(ctx context.Context, proposalID uuid.UUID, clientID uuid.UUID) error {
	p, err := s.proposals.GetByID(ctx, proposalID)
	if err != nil {
		return err
	}

	job, err := s.jobs.GetByID(ctx, p.JobID)
	if err != nil {
		return err
	}
	if job.ClientID != clientID {
		return fmt.Errorf("client does not own job")
	}
	if job.Status != string(StatusFunded) {
		return fmt.Errorf("job must be funded before hiring; current: %s", job.Status)
	}

	if err := s.escrow.AssignArtisan(ctx, job.ID, p.ArtisanID); err != nil {
		return err
	}

	if err := s.proposals.SetStatus(ctx, p.ID, "accepted"); err != nil {
		return err
	}
	return s.proposals.RejectOthersForJob(ctx, job.ID, p.ID)
}
