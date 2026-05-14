#!/bin/bash

# This script simulates a Squad charge_successful webhook payload
# Use this for local testing without real money.

WEBHOOK_URL="http://localhost:8080/api/v1/webhook/squad"
SECRET="your_webhook_secret_here" # Change this to match SQUAD_WEBHOOK_SECRET in .env

PAYLOAD='{
  "event": "virtual_account_deposit",
  "data": {
    "transaction_reference": "TXN_MOCK_001",
    "virtual_account_number": "1234567890",
    "amount": 1000000
  }
}'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha512 -hmac "$SECRET" | awk '{print $2}')

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -H "x-squad-signature: $SIGNATURE" \
  -d "$PAYLOAD"

echo ""
echo "Webhook simulated!"
