package service

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type DisputeService struct {
	disputes *repository.DisputeRepository
	jobs     *repository.JobRepository
	gemini   *ai.GeminiService
}

func NewDisputeService(disputes *repository.DisputeRepository, jobs *repository.JobRepository, gemini *ai.GeminiService) *DisputeService {
	return &DisputeService{disputes: disputes, jobs: jobs, gemini: gemini}
}

func (s *DisputeService) OpenDispute(ctx context.Context, jobID, openerID uuid.UUID, reason string) (*repository.Dispute, error) {
	job, err := s.jobs.GetByID(ctx, jobID)
	if err != nil {
		return nil, err
	}
	if job.Status != string(StatusSubmitted) && job.Status != string(StatusReleased) {
		return nil, fmt.Errorf("cannot dispute job in state: %s", job.Status)
	}

	suggestion, err := s.gemini.MediateDispute(ctx, reason, job.BudgetKobo)
	if err != nil {
		return nil, err
	}

	aiJSON := json.RawMessage(suggestion)
	d := &repository.Dispute{
		ID:               uuid.New(),
		JobID:            jobID,
		OpenerID:         openerID,
		Reason:           reason,
		AIRecommendation: []byte(aiJSON),
		State:            "ai_proposed",
	}

	if err := s.disputes.Create(ctx, d); err != nil {
		return nil, err
	}

	if err := s.jobs.UpdateStatus(ctx, jobID, string(StatusDisputed)); err != nil {
		return nil, err
	}

	return d, nil
}

func (s *DisputeService) AcceptMediation(ctx context.Context, disputeID, actorID uuid.UUID, resolution map[string]any) error {
	resJSON, err := json.Marshal(resolution)
	if err != nil {
		return err
	}

	d, err := s.disputes.GetByID(ctx, disputeID)
	if err != nil {
		return err
	}

	if err := s.disputes.SetResolution(ctx, d.ID, resJSON, "resolved"); err != nil {
		return err
	}

	return s.jobs.UpdateStatus(ctx, d.JobID, string(StatusSettled))
}

