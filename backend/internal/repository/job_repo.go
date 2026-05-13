package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type JobRepository struct {
	db *pgxpool.Pool
}

func NewJobRepository(db *pgxpool.Pool) *JobRepository {
	return &JobRepository{db: db}
}

type Job struct {
	ID                  uuid.UUID
	ClientID            uuid.UUID
	ArtisanID           *uuid.UUID
	Title               string
	Description         string
	Category            string
	BudgetKobo          int64
	Status              string
	SquadVirtualAccount *string
}

func (r *JobRepository) Create(ctx context.Context, job *Job) error {
	query := `
		INSERT INTO jobs (id, client_id, title, description, category, budget_kobo, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	_, err := r.db.Exec(ctx, query, job.ID, job.ClientID, job.Title, job.Description, job.Category, job.BudgetKobo, job.Status)
	return err
}

func (r *JobRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := r.db.Exec(ctx, query, status, id)
	return err
}

func (r *JobRepository) SetVirtualAccount(ctx context.Context, id uuid.UUID, accountNum string) error {
	query := `UPDATE jobs SET squad_virtual_account = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := r.db.Exec(ctx, query, accountNum, id)
	return err
}

func (r *JobRepository) GetByID(ctx context.Context, id uuid.UUID) (*Job, error) {
	query := `SELECT id, client_id, artisan_id, title, description, category, budget_kobo, status, squad_virtual_account FROM jobs WHERE id = $1`
	var job Job
	err := r.db.QueryRow(ctx, query, id).Scan(
		&job.ID, &job.ClientID, &job.ArtisanID, &job.Title, &job.Description, &job.Category, &job.BudgetKobo, &job.Status, &job.SquadVirtualAccount,
	)
	if err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *JobRepository) GetByVirtualAccount(ctx context.Context, accountNum string) (*Job, error) {
	query := `SELECT id, client_id, artisan_id, title, description, category, budget_kobo, status, squad_virtual_account FROM jobs WHERE squad_virtual_account = $1`
	var job Job
	err := r.db.QueryRow(ctx, query, accountNum).Scan(
		&job.ID, &job.ClientID, &job.ArtisanID, &job.Title, &job.Description, &job.Category, &job.BudgetKobo, &job.Status, &job.SquadVirtualAccount,
	)
	if err != nil {
		return nil, err
	}
	return &job, nil
}

func (r *JobRepository) CreateLedgerEntry(ctx context.Context, jobID uuid.UUID, amount int64, entryType, accountType, desc string) error {
	query := `
		INSERT INTO ledger_entries (job_id, amount_kobo, entry_type, account_type, description)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(ctx, query, jobID, amount, entryType, accountType, desc)
	return err
}
