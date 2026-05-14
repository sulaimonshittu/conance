$Url = "http://localhost:8080/api/v1/webhook/squad"
$Secret = "your_webhook_secret_here"
$Payload = '{"event":"virtual_account_deposit","data":{"transaction_reference":"TXN_MOCK_001","virtual_account_number":"1234567890","amount":1000000}}'

$HMAC = [System.Security.Cryptography.HMACSHA512]::new([System.Text.Encoding]::UTF8.GetBytes($Secret))
$HashBytes = $HMAC.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($Payload))
$Signature = [System.BitConverter]::ToString($HashBytes).Replace("-", "").ToLower()

Invoke-RestMethod -Uri $Url -Method Post -Body $Payload -ContentType "application/json" -Headers @{ "x-squad-signature" = $Signature }

Write-Host "`nWebhook simulated successfully!"
