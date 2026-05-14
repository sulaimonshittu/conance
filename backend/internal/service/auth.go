package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/conance/backend/pkg/utils"
	"github.com/redis/go-redis/v9"
)

type AuthService struct {
	redis *redis.Client
	sms   *SMSService
}

func NewAuthService(r *redis.Client, sms *SMSService) *AuthService {
	return &AuthService{redis: r, sms: sms}
}

func (s *AuthService) RequestOTP(ctx context.Context, phone string) (string, error) {
	otp := utils.GenerateOTP()
	// Store OTP in Redis with 5-minute expiry
	err := s.redis.Set(ctx, "otp:"+phone, otp, 5*time.Minute).Err()
	if err != nil {
		return "", err
	}
	
	// Send via SMS Service
	if err := s.sms.SendOTP(ctx, phone, otp); err != nil {
		return "", fmt.Errorf("failed to send SMS: %w", err)
	}
	
	return otp, nil
}

func (s *AuthService) VerifyOTP(ctx context.Context, phone, otp string) (bool, error) {
	val, err := s.redis.Get(ctx, "otp:"+phone).Result()
	if err == redis.Nil {
		return false, errors.New("OTP expired or not found")
	} else if err != nil {
		return false, err
	}

	if val != otp {
		return false, nil
	}

	// Delete OTP after successful verification
	s.redis.Del(ctx, "otp:"+phone)
	return true, nil
}
