package service

import (
	"context"
	"fmt"
	"log"
)

// SMSService defines the interface for sending SMS notifications (OTP, Payment alerts)
type SMSService struct {
	// In a real app, this would use a provider like Termii or Twilio
	provider string
}

func NewSMSService() *SMSService {
	return &SMSService{provider: "MockSMSProvider"}
}

// SendOTP sends a 6-digit code to the user's phone
func (s *SMSService) SendOTP(ctx context.Context, phone, otp string) error {
	msg := fmt.Sprintf("Your Conance OTP is: %s. Valid for 5 minutes. Do not share.", otp)
	
	// MOCK: In the hackathon, we log to console since we don't have a paid SMS provider key
	log.Printf("[SMS] Sending to %s: %s", phone, msg)
	
	return nil
}

// SendPaymentAlert notifies the artisan that funds have been secured in escrow
func (s *SMSService) SendPaymentAlert(ctx context.Context, phone string, amount int64) error {
	msg := fmt.Sprintf("Conance Alert: Funds for your job (NGN %.2f) are now SECURED in escrow. You can start work!", float64(amount)/100)
	log.Printf("[SMS] Sending to %s: %s", phone, msg)
	return nil
}
