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
		Email      string
		Name       string
		BVN        string
		DOB        string
		Gender     string
		Address    string
		Role       string
		TrustScore int
	}{
		// --- CLIENTS ---
		{"0191c955-0810-7e8c-8000-000000000001", "08012345678", "tunde@example.com", "Tunde Sanusi", "22222222221", "01/01/1990", "1", "Lekki Phase 1, Lagos", "client", 85},
		{"0191c955-0810-7e8c-8000-000000000010", "08022223333", "aisha@example.com", "Aisha Bello", "22222222221", "05/15/1992", "2", "Gwarinpa Estate, Abuja", "client", 95},
		{"0191c955-0810-7e8c-8000-000000000011", "08033334444", "obi@example.com", "Obi Nwosu", "22222222221", "10/20/1988", "1", "GRA Phase 2, Port Harcourt", "client", 80},
		{"0191c955-0810-7e8c-8000-000000000020", "08055556666", "chioma@example.com", "Chioma Egwu", "22222222221", "03/12/1995", "2", "Victoria Island, Lagos", "client", 90},
		{"0191c955-0810-7e8c-8000-000000000021", "08077778888", "bolu@example.com", "Boluwatife Ade", "22222222221", "08/25/1984", "1", "Ikeja GRA, Lagos", "client", 88},

		// --- ARTISANS ---
		// Plumbing
		{"0191c955-0810-7e8c-8000-000000000002", "08123456789", "chika@example.com", "Mama Chika", "22222222221", "03/12/1985", "2", "Surulere, Lagos", "artisan", 98},
		{"0191c955-0810-7e8c-8000-000000000006", "08167890123", "sunday@example.com", "Sunday the Plumber", "22222222221", "12/14/1989", "1", "Ajah, Lagos", "artisan", 82},
		
		// Electrical & AC
		{"0191c955-0810-7e8c-8000-000000000003", "08134567890", "emeka@example.com", "Electrician Emeka", "22222222221", "07/22/1991", "1", "Ikeja, Lagos", "artisan", 90},
		{"0191c955-0810-7e8c-8000-000000000030", "08199990001", "femi@example.com", "Femi AC Expert", "22222222221", "04/05/1988", "1", "Magodo, Lagos", "artisan", 94},
		
		// Carpentry & Furniture
		{"0191c955-0810-7e8c-8000-000000000005", "08156789012", "kazeem@example.com", "Kazeem Woodworks", "22222222221", "08/05/1987", "1", "Lekki, Lagos", "artisan", 88},
		{"0191c955-0810-7e8c-8000-000000000031", "08199990002", "ibrahim@example.com", "Ibrahim Furniture", "22222222221", "02/14/1982", "1", "Lugbe, Abuja", "artisan", 91},

		// Cleaning & Pest Control
		{"0191c955-0810-7e8c-8000-000000000004", "08145678901", "bisi@example.com", "Bisi Cleaners", "22222222221", "11/30/1993", "2", "Yaba, Lagos", "artisan", 95},
		{"0191c955-0810-7e8c-8000-000000000032", "08199990003", "fatima@example.com", "Fatima Deep Clean", "22222222221", "06/20/1996", "2", "Asokoro, Abuja", "artisan", 93},
		
		// Painting & Decor
		{"0191c955-0810-7e8c-8000-000000000033", "08199990004", "musa@example.com", "Musa the Painter", "22222222221", "09/10/1985", "1", "Mushin, Lagos", "artisan", 85},
		{"0191c955-0810-7e8c-8000-000000000034", "08199990005", "grace@example.com", "Grace Interiors", "22222222221", "12/25/1990", "2", "Wuse 2, Abuja", "artisan", 89},

		// Beauty & Fashion (Tailoring/Hair)
		{"0191c955-0810-7e8c-8000-000000000035", "08199990006", "blessing@example.com", "Blessing Stitches", "22222222221", "01/15/1994", "2", "Aba Road, Port Harcourt", "artisan", 96},
		{"0191c955-0810-7e8c-8000-000000000036", "08199990007", "joy@example.com", "Joy Hair Braiding", "22222222221", "07/04/1997", "2", "Ikorodu, Lagos", "artisan", 87},
	}

	for _, u := range users {
		_, err = pool.Exec(ctx, `
			INSERT INTO users (id, phone_number, email, full_name, bvn, dob, gender, address, role, is_verified, trust_score)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
			ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, bvn = EXCLUDED.bvn, dob = EXCLUDED.dob, gender = EXCLUDED.gender, address = EXCLUDED.address
		`, u.ID, u.Phone, u.Email, u.Name, u.BVN, u.DOB, u.Gender, u.Address, u.Role, u.TrustScore)
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
		{"0191c955-0810-7e8c-8000-000000000002", "plumbing", "Professional plumber with 15 years experience. Specialized in industrial leak detection, borehole repairs, and modern bathroom fittings. Known as Mama Chika in Surulere.", 500000},
		{"0191c955-0810-7e8c-8000-000000000006", "plumbing", "Young, energetic plumber available for emergency call-outs. Expert in water heater repairs and kitchen drainage clearing.", 350000},
		{"0191c955-0810-7e8c-8000-000000000003", "electrical", "Licensed electrician. Home wiring specialist, solar panel installation, and complex generator repairs. Reliable service in Ikeja and environs.", 650000},
		{"0191c955-0810-7e8c-8000-000000000030", "electrical", "AC installation and maintenance expert. I repair all brands of air conditioners, including industrial chillers. Quick service in Magodo.", 550000},
		{"0191c955-0810-7e8c-8000-000000000005", "carpentry", "Master carpenter. Custom furniture design, kitchen cabinets, and roof structural work. Using premium hardwood for all projects.", 850000},
		{"0191c955-0810-7e8c-8000-000000000031", "carpentry", "Abuja-based furniture maker. Modern office desks, bed frames, and wardrobe installations. High-quality finishing guaranteed.", 700000},
		{"0191c955-0810-7e8c-8000-000000000004", "cleaning", "Professional post-construction cleaning and deep house cleaning. We use eco-friendly chemicals and steam cleaners. Yaba based.", 400000},
		{"0191c955-0810-7e8c-8000-000000000032", "cleaning", "Premium janitorial services for offices and luxury apartments in Asokoro. Specialized in carpet cleaning and upholstery care.", 450000},
		{"0191c955-0810-7e8c-8000-000000000033", "painting", "Master of decorative painting and wallpaper installation. We handle large commercial projects and artistic wall murals in Lagos.", 300000},
		{"0191c955-0810-7e8c-8000-000000000034", "painting", "Professional house painter based in Abuja. Expert in pop ceiling designs and premium paint finishes for luxury homes.", 350000},
		{"0191c955-0810-7e8c-8000-000000000035", "tailoring", "Expert female tailor in Port Harcourt. Specialized in African traditional wear, corporate suits, and bridal gowns. Fast delivery.", 500000},
		{"0191c955-0810-7e8c-8000-000000000036", "hairdressing", "Expert hair braider and wig maker. Knotless braids, cornrows, and frontal installations. Home service available in Ikorodu.", 250000},
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
