package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ChatRepository struct {
	db *pgxpool.Pool
}

func NewChatRepository(db *pgxpool.Pool) *ChatRepository {
	return &ChatRepository{db: db}
}

type Message struct {
	ID           uuid.UUID
	JobID        uuid.UUID
	SenderID     uuid.UUID
	Body         string
	RedactedBody *string
	RiskScores   []byte
}

func (r *ChatRepository) CreateMessage(ctx context.Context, m *Message) error {
	query := `
		INSERT INTO messages (id, job_id, sender_id, body, redacted_body, risk_scores_json)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query, m.ID, m.JobID, m.SenderID, m.Body, m.RedactedBody, m.RiskScores)
	return err
}

func (r *ChatRepository) CreateFlag(ctx context.Context, messageID uuid.UUID, flagType string, severity string) error {
	query := `
		INSERT INTO chat_flags (message_id, type, severity)
		VALUES ($1, $2, $3)
	`
	_, err := r.db.Exec(ctx, query, messageID, flagType, severity)
	return err
}
