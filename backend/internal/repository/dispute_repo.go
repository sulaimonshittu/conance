package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DisputeRepository struct {
	db *pgxpool.Pool
}

func NewDisputeRepository(db *pgxpool.Pool) *DisputeRepository {
	return &DisputeRepository{db: db}
}

type Dispute struct {
	ID                uuid.UUID
	JobID             uuid.UUID
	OpenerID          uuid.UUID
	Reason            string
	AIRecommendation  []byte
	Resolution        []byte
	State             string
}

func (r *DisputeRepository) Create(ctx context.Context, d *Dispute) error {
	query := `
		INSERT INTO disputes (id, job_id, opener_id, reason, ai_recommendation_json, state)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query, d.ID, d.JobID, d.OpenerID, d.Reason, d.AIRecommendation, d.State)
	return err
}

func (r *DisputeRepository) GetByID(ctx context.Context, id uuid.UUID) (*Dispute, error) {
	query := `SELECT id, job_id, opener_id, reason, ai_recommendation_json, resolution_json, state FROM disputes WHERE id = $1`
	var d Dispute
	if err := r.db.QueryRow(ctx, query, id).Scan(&d.ID, &d.JobID, &d.OpenerID, &d.Reason, &d.AIRecommendation, &d.Resolution, &d.State); err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *DisputeRepository) SetResolution(ctx context.Context, id uuid.UUID, resolutionJSON []byte, state string) error {
	query := `UPDATE disputes SET resolution_json = $1, state = $2 WHERE id = $3`
	_, err := r.db.Exec(ctx, query, resolutionJSON, state, id)
	return err
}

