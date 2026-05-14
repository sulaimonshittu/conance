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
	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})

	// Initialize Repos
	jobRepo := repository.NewJobRepository(pool)
	userRepo := repository.NewUserRepository(pool)
	proposalRepo := repository.NewProposalRepository(pool)
	chatRepo := repository.NewChatRepository(pool)
	disputeRepo := repository.NewDisputeRepository(pool)
	webhookRepo := repository.NewWebhookRepository(pool)

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
	proposalService := service.NewProposalService(proposalRepo, jobRepo, userRepo, escrowService, geminiService)
	chatService := service.NewChatService(chatRepo, geminiService)
	disputeService := service.NewDisputeService(disputeRepo, jobRepo, geminiService)

	// Initialize Handlers
	authHandler := api.NewAuthHandler(authService)
	jobHandler := api.NewJobHandler(escrowService, jobService, geminiService)
	aiHandler := api.NewAIHandler(geminiService)
	proposalHandler := api.NewProposalHandler(proposalService)
	chatHandler := api.NewChatHandler(chatService)
	disputeHandler := api.NewDisputeHandler(disputeService)
	payoutHandler := api.NewPayoutHandler(squadClient)
	webhookHandler := api.NewWebhookHandler(escrowService, webhookRepo)

	// Router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/auth/otp", authHandler.RequestOTP)
		r.Post("/auth/verify", authHandler.VerifyOTP)

		r.Post("/jobs", jobHandler.CreateJob)
		r.Post("/jobs/voice", jobHandler.CreateJobFromVoice)
		r.Get("/jobs/{id}/recommendations", jobHandler.GetRecommendations)
		r.Get("/artisans/{id}/recommendations", jobHandler.GetArtisanRecommendations)
		r.Post("/jobs/{id}/proposals", proposalHandler.SubmitProposal)
		r.Get("/jobs/{id}/proposals", proposalHandler.ListProposals)
		r.Post("/jobs/{id}/messages", chatHandler.SendMessage)
		r.Post("/jobs/{id}/assign", jobHandler.AssignArtisan)
		r.Post("/jobs/{id}/in-progress", jobHandler.MarkInProgress)
		r.Post("/jobs/{id}/submit", jobHandler.SubmitWork)
		r.Post("/jobs/{id}/release", jobHandler.ReleaseFunds)
		r.Post("/jobs/{id}/disputes", disputeHandler.OpenDispute)
		r.Post("/proposals/{id}/accept", proposalHandler.AcceptProposal)
		r.Post("/disputes/{id}/accept-mediation", disputeHandler.AcceptMediation)
		
		r.Post("/ai/transcribe", aiHandler.TranscribeVoice)

		r.Post("/payout/account/lookup", payoutHandler.AccountLookup)
		
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
