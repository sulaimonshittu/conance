package repository

import (
	"context"

	"github.com/google/uuid"
)

// AssignArtisan links an artisan to a job
func (r *JobRepository) AssignArtisan(ctx context.Context, jobID, artisanID uuid.UUID) error {
	query := `UPDATE jobs SET artisan_id = $1, status = 'assigned', updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := r.db.Exec(ctx, query, artisanID, jobID)
	return err
}

// SubmitWork records a job submission for verification
func (r *JobRepository) CreateSubmission(ctx context.Context, jobID, artisanID uuid.UUID, photos []string, note string) (uuid.UUID, error) {
	id := uuid.New()
	query := `
		INSERT INTO job_submissions (id, job_id, artisan_id, photo_urls, note)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(ctx, query, id, jobID, artisanID, photos, note)
	return id, err
}

func (r *JobRepository) UpdateSubmissionAIStatus(ctx context.Context, id uuid.UUID, status, feedback string) error {
	query := `UPDATE job_submissions SET ai_verification_status = $1, ai_feedback = $2 WHERE id = $3`
	_, err := r.db.Exec(ctx, query, status, feedback, id)
	return err
}

func (r *JobRepository) GetArtisansByCategory(ctx context.Context, category string) ([]string, error) {
	// Simple query for ranking; real one would use PostGIS for proximity
	query := `
		SELECT u.full_name || ' (Rating: ' || u.trust_score || ')'
		FROM users u
		JOIN artisan_profiles ap ON u.id = ap.user_id
		WHERE ap.category = $1
		LIMIT 10
	`
	rows, err := r.db.Query(ctx, query, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var artisans []string
	for rows.Next() {
		var a string
		if err := rows.Scan(&a); err != nil {
			return nil, err
		}
		artisans = append(artisans, a)
	}
	return artisans, nil
}

func (r *JobRepository) GetJobsByCategory(ctx context.Context, category string) ([]string, error) {
	query := `
		SELECT title || ' - Budget: NGN ' || (budget_kobo/100)::text || ' (' || description || ')'
		FROM jobs
		WHERE category = $1 AND status = 'posted'
		LIMIT 10
	`
	rows, err := r.db.Query(ctx, query, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var jobs []string
	for rows.Next() {
		var j string
		if err := rows.Scan(&j); err != nil {
			return nil, err
		}
		jobs = append(jobs, j)
	}
	return jobs, nil
}
