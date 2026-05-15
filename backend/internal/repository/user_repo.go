package repository

import (
	"context"
	"encoding/json"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

type User struct {
	ID          uuid.UUID
	PhoneNumber string
	Email       string
	FullName    string
	BVN         string
	DOB         string
	Gender      string
	Address     string
	Role        string
	IsVerified  bool
	TrustScore  int
}

type ArtisanProfile struct {
	UserID     uuid.UUID
	Category   string
	Bio        string
	Location   interface{} // Geography point
	HourlyRate int64
}

func (r *UserRepository) Create(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (id, phone_number, email, full_name, bvn, dob, gender, address, role)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err := r.db.Exec(ctx, query, user.ID, user.PhoneNumber, user.Email, user.FullName, user.BVN, user.DOB, user.Gender, user.Address, user.Role)
	return err
}

func (r *UserRepository) GetByPhone(ctx context.Context, phone string) (*User, error) {
	query := `SELECT id, phone_number, email, full_name, bvn, dob, gender, address, role, is_verified, trust_score FROM users WHERE phone_number = $1`
	var user User
	err := r.db.QueryRow(ctx, query, phone).Scan(&user.ID, &user.PhoneNumber, &user.Email, &user.FullName, &user.BVN, &user.DOB, &user.Gender, &user.Address, &user.Role, &user.IsVerified, &user.TrustScore)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*User, error) {
	query := `SELECT id, phone_number, email, full_name, bvn, dob, gender, address, role, is_verified, trust_score FROM users WHERE id = $1`
	var user User
	err := r.db.QueryRow(ctx, query, id).Scan(&user.ID, &user.PhoneNumber, &user.Email, &user.FullName, &user.BVN, &user.DOB, &user.Gender, &user.Address, &user.Role, &user.IsVerified, &user.TrustScore)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetArtisanProfile(ctx context.Context, userID uuid.UUID) (*ArtisanProfile, error) {
	query := `SELECT user_id, category, bio, hourly_rate_kobo FROM artisan_profiles WHERE user_id = $1`
	var p ArtisanProfile
	err := r.db.QueryRow(ctx, query, userID).Scan(&p.UserID, &p.Category, &p.Bio, &p.HourlyRate)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *UserRepository) UpdateTrustScore(ctx context.Context, userID uuid.UUID, newScore int, components any) error {
	if newScore < 0 {
		newScore = 0
	}
	if newScore > 100 {
		newScore = 100
	}

	var compJSON []byte
	if components != nil {
		b, err := json.Marshal(components)
		if err != nil {
			return err
		}
		compJSON = b
	}

	_, err := r.db.Exec(ctx, `UPDATE users SET trust_score = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, newScore, userID)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx, `INSERT INTO trust_score_history (user_id, score, components) VALUES ($1, $2, $3::jsonb)`, userID, newScore, compJSON)
	return err
}
