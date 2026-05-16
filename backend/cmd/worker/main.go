package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/payment"
	"github.com/conance/backend/internal/repository"
	"github.com/conance/backend/internal/service"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func main() {
	ctx := context.Background()
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	redisURL := os.Getenv("REDIS_URL")
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Invalid Redis URL: %v", err)
	}
	rdb := redis.NewClient(opts)

	jobRepo := repository.NewJobRepository(pool)
	userRepo := repository.NewUserRepository(pool)
	squadClient := payment.NewSquadClient()

	geminiService, err := ai.NewGeminiService(ctx)
	if err != nil {
		log.Fatalf("Failed to init Gemini: %v", err)
	}
	
	escrowService := service.NewEscrowService(squadClient, jobRepo, userRepo)

	log.Println("Conance Worker started. Listening for tasks...")

	for {
		// Mocked basic consumer logic using BLPop for real queues
		result, err := rdb.BLPop(ctx, 5*time.Second, "queue:payouts", "queue:ai_moderation").Result()
		if err == redis.Nil {
			// Timeout, loop again
			continue
		} else if err != nil {
			log.Printf("Redis error: %v", err)
			time.Sleep(2 * time.Second)
			continue
		}

		queueName := result[0]
		payload := result[1]

		switch queueName {
		case "queue:payouts":
			handlePayout(ctx, escrowService, squadClient, payload)
		case "queue:ai_moderation":
			handleAIModeration(ctx, geminiService, payload)
		}
	}
}

func handlePayout(ctx context.Context, es *service.EscrowService, sq *payment.SquadClient, payload string) {
	log.Printf("Processing payout: %s", payload)
	// Example payload: {"job_id": "uuid", "artisan_id": "uuid", "amount_kobo": 500000}
	var data struct {
		JobID     string `json:"job_id"`
		ArtisanID string `json:"artisan_id"`
		Amount    int64  `json:"amount_kobo"`
	}
	if err := json.Unmarshal([]byte(payload), &data); err != nil {
		log.Printf("Invalid payout payload: %v", err)
		return
	}

	// Transfer to artisan
	req := payment.TransferRequest{
		Remark:         "Conance Payout",
		BankCode:       "058", // Mock Bank code
		CurrencyID:     "NGN",
		Amount:         "450000", // 90%
		Account:        "0123456789", // From artisan profile
		TransactionRef: "CNCE_" + data.JobID + "_PAYOUT",
		AccountName:    "Artisan Name",
	}

	resp, err := sq.Transfer(ctx, req)
	if err != nil {
		log.Printf("Payout transfer failed: %v", err)
		return
	}
	
	log.Printf("Payout transfer successful: %s", resp.Data.Status)
}

func handleAIModeration(ctx context.Context, gemini *ai.GeminiService, payload string) {
	log.Printf("Processing AI moderation for: %s", payload)
}
