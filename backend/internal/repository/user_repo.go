package repository

import (
	"context"

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
	FullName    string
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
		INSERT INTO users (id, phone_number, full_name, role)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(ctx, query, user.ID, user.PhoneNumber, user.FullName, user.Role)
	return err
}

func (r *UserRepository) GetByPhone(ctx context.Context, phone string) (*User, error) {
	query := `SELECT id, phone_number, full_name, role, is_verified, trust_score FROM users WHERE phone_number = $1`
	var user User
	err := r.db.QueryRow(ctx, query, phone).Scan(&user.ID, &user.PhoneNumber, &user.FullName, &user.Role, &user.IsVerified, &user.TrustScore)
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
