package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/conance/backend/internal/ai"
	"github.com/conance/backend/internal/api"
	"github.com/conance/backend/internal/payment"
	"github.com/conance/backend/internal/repository"
	"github.com/conance/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func main() {
	ctx := context.Background()
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	redisURL := os.Getenv("REDIS_URL")
	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})

	// Initialize Repos
	jobRepo := repository.NewJobRepository(pool)
	userRepo := repository.NewUserRepository(pool)

	// Initialize Clients & AI
	squadClient := payment.NewSquadClient()
	geminiService, err := ai.NewGeminiService(ctx)
	if err != nil {
		log.Fatalf("Failed to init Gemini: %v", err)
	}

	// Initialize Services
	smsService := service.NewSMSService()
	authService := service.NewAuthService(rdb, smsService)
	escrowService := service.NewEscrowService(squadClient, jobRepo)
	jobService := service.NewJobService(jobRepo, userRepo, geminiService)

	// Initialize Handlers
	authHandler := api.NewAuthHandler(authService)
	jobHandler := api.NewJobHandler(escrowService, jobService)
	aiHandler := api.NewAIHandler(geminiService)
	webhookHandler := api.NewWebhookHandler(escrowService)

	// Router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/auth/otp", authHandler.RequestOTP)
		r.Post("/auth/verify", authHandler.VerifyOTP)

		r.Post("/jobs", jobHandler.CreateJob)
		r.Get("/jobs/{id}/recommendations", jobHandler.GetRecommendations)
		r.Get("/artisans/{id}/recommendations", jobHandler.GetArtisanRecommendations)
		r.Post("/jobs/{id}/submit", jobHandler.SubmitWork)
		r.Post("/jobs/{id}/release", jobHandler.ReleaseFunds)
		
		r.Post("/ai/transcribe", aiHandler.TranscribeVoice)
		
		r.Post("/webhook/squad", webhookHandler.HandleSquad)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Conance Backend starting on port %s...", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
