package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProposalRepository struct {
	db *pgxpool.Pool
}

func NewProposalRepository(db *pgxpool.Pool) *ProposalRepository {
	return &ProposalRepository{db: db}
}

type Proposal struct {
	ID         uuid.UUID
	JobID      uuid.UUID
	ArtisanID  uuid.UUID
	PriceKobo  int64
	ETAMinutes int
	Message    string
	Status     string
}

func (r *ProposalRepository) Create(ctx context.Context, p *Proposal) error {
	query := `
		INSERT INTO proposals (id, job_id, artisan_id, price_kobo, eta_minutes, message, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := r.db.Exec(ctx, query, p.ID, p.JobID, p.ArtisanID, p.PriceKobo, p.ETAMinutes, p.Message, p.Status)
	return err
}

func (r *ProposalRepository) ListByJob(ctx context.Context, jobID uuid.UUID) ([]Proposal, error) {
	query := `
		SELECT id, job_id, artisan_id, price_kobo, eta_minutes, message, status
		FROM proposals
		WHERE job_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Proposal
	for rows.Next() {
		var p Proposal
		if err := rows.Scan(&p.ID, &p.JobID, &p.ArtisanID, &p.PriceKobo, &p.ETAMinutes, &p.Message, &p.Status); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, nil
}

func (r *ProposalRepository) GetByID(ctx context.Context, id uuid.UUID) (*Proposal, error) {
	query := `
		SELECT id, job_id, artisan_id, price_kobo, eta_minutes, message, status
		FROM proposals
		WHERE id = $1
	`
	var p Proposal
	if err := r.db.QueryRow(ctx, query, id).Scan(&p.ID, &p.JobID, &p.ArtisanID, &p.PriceKobo, &p.ETAMinutes, &p.Message, &p.Status); err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProposalRepository) SetStatus(ctx context.Context, proposalID uuid.UUID, status string) error {
	query := `UPDATE proposals SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(ctx, query, status, proposalID)
	return err
}

func (r *ProposalRepository) RejectOthersForJob(ctx context.Context, jobID uuid.UUID, acceptedProposalID uuid.UUID) error {
	query := `UPDATE proposals SET status = 'rejected' WHERE job_id = $1 AND id <> $2 AND status IN ('submitted','shortlisted')`
	_, err := r.db.Exec(ctx, query, jobID, acceptedProposalID)
	return err
}
