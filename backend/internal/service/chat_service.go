package service

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/repository"
	"github.com/google/uuid"
)

type ChatService struct {
	repo   *repository.ChatRepository
	gemini *ai.GeminiService
}

func NewChatService(repo *repository.ChatRepository, gemini *ai.GeminiService) *ChatService {
	return &ChatService{repo: repo, gemini: gemini}
}

type RiskScore struct {
	IsSafe bool   `json:"is_safe"`
	Reason string `json:"reason"`
}

func (s *ChatService) SendMessage(ctx context.Context, jobID, senderID uuid.UUID, body string) (*repository.Message, error) {
	isSafe, reason, err := s.gemini.ModerationCheck(ctx, body)
	if err != nil {
		return nil, err
	}

	risk := RiskScore{IsSafe: isSafe, Reason: reason}
	riskJSON, _ := json.Marshal(risk)

	msg := &repository.Message{
		ID:         uuid.New(),
		JobID:      jobID,
		SenderID:   senderID,
		Body:       body,
		RiskScores: riskJSON,
	}

	if !isSafe {
		redacted := "[blocked by moderation]"
		msg.RedactedBody = &redacted
		if err := s.repo.CreateMessage(ctx, msg); err != nil {
			return nil, err
		}
		_ = s.repo.CreateFlag(ctx, msg.ID, "off_platform", "block")
		return nil, fmt.Errorf("message blocked: %s", reason)
	}

	if err := s.repo.CreateMessage(ctx, msg); err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *ChatService) GetJobMessages(ctx context.Context, jobID uuid.UUID) ([]*repository.Message, error) {
	return s.repo.GetMessagesByJobID(ctx, jobID)
}

