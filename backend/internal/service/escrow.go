package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/conance/backend/internal/payment"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type EscrowService struct {
	squad *payment.SquadClient
	repo  *repository.JobRepository
}

func NewEscrowService(squad *payment.SquadClient, repo *repository.JobRepository) *EscrowService {
	return &EscrowService{squad: squad, repo: repo}
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

	// Initialize Squad Virtual Account
	accNum, err := s.InitializeJobEscrow(ctx, job.ID, "Client")
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
		return errors.New("job already funded or in progress")
	}

	// Simple check: for hackathon, we assume any payment into the NUBAN funds the job
	if err := s.repo.UpdateStatus(ctx, job.ID, string(StatusFunded)); err != nil {
		return err
	}

	// Ledger entry for escrow credit
	return s.repo.CreateLedgerEntry(ctx, job.ID, amount, "credit", "escrow", "Job funding received via Squad")
}
