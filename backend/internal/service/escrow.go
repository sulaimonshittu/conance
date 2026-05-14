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
	squad *payment.SquadClient
	repo  *repository.JobRepository
}

func NewEscrowService(squad *payment.SquadClient, repo *repository.JobRepository) *EscrowService {
	return &EscrowService{squad: squad, repo: repo}
}

func (s *EscrowService) InitializeJobEscrow(ctx context.Context, jobID uuid.UUID) (string, error) {
	req := payment.VirtualAccountRequest{
		FirstName:           "Conance",
		LastName:            "Escrow",
		MiddleName:          jobID.String()[:8],
		MobileNum:           "08000000000",
		Email:               fmt.Sprintf("escrow+%s@conance.local", jobID.String()[:8]),
		CustomerIdentifier:  jobID.String(),
	}

	resp, err := s.squad.CreateVirtualAccount(ctx, req)
	if err != nil {
		return "", err
	}

	return resp.Data.VirtualAccountNumber, nil
}

// PostJob creates a job and initializes its escrow
func (s *EscrowService) PostJob(ctx context.Context, clientID uuid.UUID, title, desc, cat string, budget int64) (*repository.Job, error) {
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

	accNum, err := s.InitializeJobEscrow(ctx, job.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to init escrow: %w", err)
	}

	if err := s.repo.SetVirtualAccount(ctx, job.ID, accNum); err != nil {
		return nil, err
	}

	job.SquadVirtualAccount = &accNum
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
