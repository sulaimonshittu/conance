package payment

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type SquadClient struct {
	secretKey string
	baseURL   string
	httpClient *http.Client
}

func NewSquadClient() *SquadClient {
	return &SquadClient{
		secretKey: os.Getenv("SQUAD_SECRET_KEY"),
		baseURL:   os.Getenv("SQUAD_BASE_URL"),
		httpClient: &http.Client{},
	}
}

type VirtualAccountRequest struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	MiddleName  string `json:"middle_name"`
	MobileNum   string `json:"mobile_num"`
	Dob         string `json:"dob"`
	Email       string `json:"email"`
	Bvn         string `json:"bvn"`
	Gender      string `json:"gender"`
	Address     string `json:"address"`
	CustomerIdentifier string `json:"customer_identifier"`
}

type VirtualAccountResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		VirtualAccountNumber string `json:"virtual_account_number"`
		AccountName          string `json:"account_name"`
		BankName             string `json:"bank_name"`
	} `json:"data"`
}

type AccountLookupRequest struct {
	BankCode      string `json:"bank_code"`
	AccountNumber string `json:"account_number"`
}

type AccountLookupResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		AccountName   string `json:"account_name"`
		AccountNumber string `json:"account_number"`
	} `json:"data"`
}

// CreateVirtualAccount creates a dynamic virtual account for a specific job escrow
func (c *SquadClient) CreateVirtualAccount(ctx context.Context, req VirtualAccountRequest) (*VirtualAccountResponse, error) {
	url := fmt.Sprintf("%s/virtual-account", c.baseURL)
	
	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result VirtualAccountResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if !result.Success {
		return nil, fmt.Errorf("squad error: %s", result.Message)
	}

	return &result, nil
}

func (c *SquadClient) AccountLookup(ctx context.Context, req AccountLookupRequest) (*AccountLookupResponse, error) {
	url := fmt.Sprintf("%s/payout/account/lookup", c.baseURL)

	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result AccountLookupResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if !result.Success {
		return nil, fmt.Errorf("squad error: %s", result.Message)
	}
	return &result, nil
}

type TransferRequest struct {
	Remark        string `json:"remark"`
	BankCode      string `json:"bank_code"`
	CurrencyID    string `json:"currency_id"`
	Amount        string `json:"amount"` // string in docs usually, but kobo
	Account       string `json:"account_number"`
	TransactionRef string `json:"transaction_reference"`
	AccountName   string `json:"account_name"`
}

type TransferResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		TransactionReference string `json:"transaction_reference"`
		Status               string `json:"status"`
	} `json:"data"`
}

func (c *SquadClient) Transfer(ctx context.Context, req TransferRequest) (*TransferResponse, error) {
	url := fmt.Sprintf("%s/payout/transfer", c.baseURL)
	
	req.CurrencyID = "NGN"
	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result TransferResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if !result.Success {
		return nil, fmt.Errorf("squad transfer error: %s", result.Message)
	}
	return &result, nil
}

type RequeryResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		TransactionReference string `json:"transaction_reference"`
		Status               string `json:"status"` // e.g. success, failed, reversed
	} `json:"data"`
}

func (c *SquadClient) RequeryTransfer(ctx context.Context, reference string) (*RequeryResponse, error) {
	url := fmt.Sprintf("%s/payout/requery", c.baseURL)
	
	req := map[string]string{"transaction_reference": reference}
	body, _ := json.Marshal(req)

	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result RequeryResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if !result.Success {
		return nil, fmt.Errorf("squad requery error: %s", result.Message)
	}
	return &result, nil
}

type LedgerBalanceResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		Balance string `json:"balance"`
	} `json:"data"`
}

func (c *SquadClient) LedgerBalance(ctx context.Context) (*LedgerBalanceResponse, error) {
	url := fmt.Sprintf("%s/payout/ledger-balance", c.baseURL)

	httpReq, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result LedgerBalanceResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if !result.Success {
		return nil, fmt.Errorf("squad ledger error: %s", result.Message)
	}
	return &result, nil
}

type VerifyResponse struct {
	Status  int    `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    struct {
		TransactionStatus string `json:"transaction_status"` // success
		TransactionRef    string `json:"transaction_ref"`
		Amount            int    `json:"transaction_amount"`
	} `json:"data"`
}

func (c *SquadClient) VerifyTransaction(ctx context.Context, reference string) (*VerifyResponse, error) {
	url := fmt.Sprintf("%s/transaction/verify/%s", c.baseURL, reference)

	httpReq, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Authorization", "Bearer "+c.secretKey)

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result VerifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if !result.Success {
		return nil, fmt.Errorf("squad verify error: %s", result.Message)
	}
	return &result, nil
}
