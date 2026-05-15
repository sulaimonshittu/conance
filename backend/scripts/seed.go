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

	log.Println("Seeding database with test users...")

	// Users to insert
	users := []struct {
		ID         string
		Phone      string
		Name       string
		Role       string
		TrustScore int
	}{
		// Clients
		{"0191c955-0810-7e8c-8000-000000000001", "08012345678", "Tunde (Client)", "client", 80},
		{"0191c955-0810-7e8c-8000-000000000010", "08022223333", "Aisha (Client)", "client", 90},
		{"0191c955-0810-7e8c-8000-000000000011", "08033334444", "Obi (Client)", "client", 75},

		// Artisans
		{"0191c955-0810-7e8c-8000-000000000002", "08123456789", "Mama Chika (Plumber)", "artisan", 95},
		{"0191c955-0810-7e8c-8000-000000000003", "08134567890", "Emeka (Electrician)", "artisan", 88},
		{"0191c955-0810-7e8c-8000-000000000004", "08145678901", "Bisi (Cleaner)", "artisan", 92},
		{"0191c955-0810-7e8c-8000-000000000005", "08156789012", "Kazeem (Carpenter)", "artisan", 85},
		{"0191c955-0810-7e8c-8000-000000000006", "08167890123", "Sunday (Plumber)", "artisan", 78},
	}

	for _, u := range users {
		_, err = pool.Exec(ctx, `
			INSERT INTO users (id, phone_number, full_name, role, is_verified, trust_score)
			VALUES ($1, $2, $3, $4, true, $5)
			ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name
		`, u.ID, u.Phone, u.Name, u.Role, u.TrustScore)
		if err != nil {
			log.Fatalf("failed to insert user %s: %v", u.Name, err)
		}
	}

	// Artisan Profiles to insert
	profiles := []struct {
		UserID     string
		Category   string
		Bio        string
		HourlyRate int
	}{
		{"0191c955-0810-7e8c-8000-000000000002", "plumbing", "Expert Plumber in Surulere. Specializes in pipe leaks and kitchen sinks.", 500000},
		{"0191c955-0810-7e8c-8000-000000000003", "electrical", "Experienced electrician based in Ikeja. Handles home wiring and generator repairs.", 600000},
		{"0191c955-0810-7e8c-8000-000000000004", "cleaning", "Professional deep cleaning services and post-construction cleaning in Yaba.", 300000},
		{"0191c955-0810-7e8c-8000-000000000005", "carpentry", "Furniture making and wood repair specialist in Lekki. Custom cabinets.", 800000},
		{"0191c955-0810-7e8c-8000-000000000006", "plumbing", "Fast response plumber in Ajah. Deals with water heater repairs and pipe laying.", 450000},
	}

	for _, p := range profiles {
		_, err = pool.Exec(ctx, `
			INSERT INTO artisan_profiles (user_id, category, bio, hourly_rate_kobo)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (user_id) DO UPDATE SET bio = EXCLUDED.bio, category = EXCLUDED.category
		`, p.UserID, p.Category, p.Bio, p.HourlyRate)
		if err != nil {
			log.Fatalf("failed to insert profile for %s: %v", p.UserID, err)
		}
	}

	log.Println("Database successfully seeded with a diverse marketplace of artisans and clients!")
}
