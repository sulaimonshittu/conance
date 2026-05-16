package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/conance/backend/internal/payment"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type EscrowStatus string

const (
	StatusPosted     EscrowStatus = "posted"
	StatusFunded     EscrowStatus = "funded"
	StatusAssigned   EscrowStatus = "assigned"
	StatusInProgress EscrowStatus = "in_progress"
	StatusSubmitted  EscrowStatus = "submitted"
	StatusReleased   EscrowStatus = "released"
	StatusDisputed   EscrowStatus = "disputed"
	StatusSettled    EscrowStatus = "settled"
	StatusCancelled  EscrowStatus = "cancelled"
)

var ErrInvalidTransition = errors.New("invalid escrow state transition")

type EscrowService struct {
	squad    *payment.SquadClient
	repo     *repository.JobRepository
	userRepo *repository.UserRepository
}

func NewEscrowService(squad *payment.SquadClient, repo *repository.JobRepository, userRepo *repository.UserRepository) *EscrowService {
	return &EscrowService{squad: squad, repo: repo, userRepo: userRepo}
}

func (s *EscrowService) InitializeJobEscrow(ctx context.Context, jobID uuid.UUID, client *repository.User) (string, error) {
	req := payment.VirtualAccountRequest{
		FirstName:           client.FullName,
		LastName:            "Conance",
		MiddleName:          jobID.String()[:8],
		MobileNum:           client.PhoneNumber,
		Dob:                 client.DOB,
		Email:               client.Email,
		Bvn:                 client.BVN,
		Gender:              client.Gender,
		Address:             client.Address,
		CustomerIdentifier:  jobID.String(),
		BeneficiaryAccount:  "4920299492", // Default beneficiary for escrow
	}

	resp, err := s.squad.CreateVirtualAccount(ctx, req)
	if err != nil {
		return "", err
	}

	return resp.Data.VirtualAccountNumber, nil
}

// PostJob creates a job and initializes its escrow
func (s *EscrowService) PostJob(ctx context.Context, clientID uuid.UUID, title, desc, cat string, budget int64) (*repository.Job, error) {
	client, err := s.userRepo.GetByID(ctx, clientID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch client: %w", err)
	}

	job := &repository.Job{
		ID:          uuid.New(),
		ClientID:    clientID,
		Title:       title,
		Description: desc,
		Category:    cat,
		BudgetKobo:  budget,
		Status:      string(StatusPosted),
	}

	if err := s.repo.Create(ctx, job); err != nil {
		return nil, err
	}

	accNum, err := s.InitializeJobEscrow(ctx, job.ID, client)
	if err != nil {
		// Log but don't fail — Squad sandbox may have account limits
		fmt.Printf("WARNING: escrow init failed (job still created): %v\n", err)
	} else {
		if err := s.repo.SetVirtualAccount(ctx, job.ID, accNum); err != nil {
			return nil, err
		}
		job.SquadVirtualAccount = &accNum
	}

	return job, nil
}

// HandleFunded transition job to funded status when Squad notifies of payment
func (s *EscrowService) HandleFunded(ctx context.Context, accountNum string, amount int64) error {
	job, err := s.repo.GetByVirtualAccount(ctx, accountNum)
	if err != nil {
		return err
	}

	if job.Status != string(StatusPosted) {
		return ErrInvalidTransition
	}

	if err := s.repo.UpdateStatus(ctx, job.ID, string(StatusFunded)); err != nil {
		return err
	}

	_ = s.repo.CreateEscrowEvent(ctx, job.ID, "funded", map[string]any{"account": accountNum, "amount_kobo": amount}, nil)

	return s.repo.CreateLedgerEntry(ctx, job.ID, amount, "credit", "escrow", "Job funding received via Squad")
}

func (s *EscrowService) AssignArtisan(ctx context.Context, jobID, artisanID uuid.UUID) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}
	if job.Status != string(StatusFunded) {
		return ErrInvalidTransition
	}
	if err := s.repo.AssignArtisan(ctx, jobID, artisanID); err != nil {
		return err
	}
	_ = s.repo.CreateEscrowEvent(ctx, jobID, "assigned", map[string]any{"artisan_id": artisanID.String()}, nil)
	return nil
}

func (s *EscrowService) MarkInProgress(ctx context.Context, jobID uuid.UUID) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}
	if job.Status != string(StatusAssigned) {
		return ErrInvalidTransition
	}
	if err := s.repo.UpdateStatus(ctx, jobID, string(StatusInProgress)); err != nil {
		return err
	}
	_ = s.repo.CreateEscrowEvent(ctx, jobID, "in_progress", nil, nil)
	return nil
}

func (s *EscrowService) Cancel(ctx context.Context, jobID uuid.UUID) error {
	job, err := s.repo.GetByID(ctx, jobID)
	if err != nil {
		return err
	}
	if job.Status == string(StatusReleased) || job.Status == string(StatusSettled) {
		return ErrInvalidTransition
	}
	if err := s.repo.UpdateStatus(ctx, jobID, string(StatusCancelled)); err != nil {
		return err
	}
	_ = s.repo.CreateEscrowEvent(ctx, jobID, "cancelled", nil, nil)
	return nil
}
