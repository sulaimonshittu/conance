package utils

import (
	"crypto/rand"
	"math/big"
	"fmt"
)

// GenerateOTP creates a 6-digit numeric OTP
func GenerateOTP() string {
	max := big.NewInt(1000000)
	n, _ := rand.Int(rand.Reader, max)
	return fmt.Sprintf("%06d", n)
}
