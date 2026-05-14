package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type WebhookRepository struct {
	db *pgxpool.Pool
}

func NewWebhookRepository(db *pgxpool.Pool) *WebhookRepository {
	return &WebhookRepository{db: db}
}

func (r *WebhookRepository) InsertIfNew(ctx context.Context, provider, eventID, eventType string, payload []byte, signatureValid bool) (bool, error) {
	query := `
		INSERT INTO webhook_events (provider, event_id, event_type, payload, signature_valid)
		VALUES ($1, $2, $3, $4::jsonb, $5)
		ON CONFLICT (provider, event_id) DO NOTHING
	`
	tag, err := r.db.Exec(ctx, query, provider, eventID, eventType, payload, signatureValid)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() == 1, nil
}

func (r *WebhookRepository) MarkProcessed(ctx context.Context, provider, eventID string) error {
	query := `UPDATE webhook_events SET processed_at = CURRENT_TIMESTAMP WHERE provider = $1 AND event_id = $2`
	_, err := r.db.Exec(ctx, query, provider, eventID)
	return err
}
