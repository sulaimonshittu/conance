package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using env vars")
	}

	ctx := context.Background()
	dbURL := os.Getenv("DATABASE_URL")
	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	log.Println("Seeding database...")

	// Create Client
	_, err = pool.Exec(ctx, `
		INSERT INTO users (id, phone_number, full_name, role, is_verified, trust_score)
		VALUES ('0191c955-0810-7e8c-8000-000000000001', '08012345678', 'Tunde (Client)', 'client', true, 80)
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		log.Fatalf("failed to insert client: %v", err)
	}

	// Create Artisan
	_, err = pool.Exec(ctx, `
		INSERT INTO users (id, phone_number, full_name, role, is_verified, trust_score)
		VALUES ('0191c955-0810-7e8c-8000-000000000002', '08123456789', 'Mama Chika (Artisan)', 'artisan', true, 95)
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		log.Fatalf("failed to insert artisan user: %v", err)
	}

	_, err = pool.Exec(ctx, `
		INSERT INTO artisan_profiles (user_id, category, bio, hourly_rate_kobo)
		VALUES ('0191c955-0810-7e8c-8000-000000000002', 'plumbing', 'Expert Plumber in Surulere', 500000)
		ON CONFLICT DO NOTHING
	`)
	if err != nil {
		log.Fatalf("failed to insert artisan profile: %v", err)
	}

	log.Println("Seed completed successfully!")
}
