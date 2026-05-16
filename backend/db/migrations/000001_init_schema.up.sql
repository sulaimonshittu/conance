-- +goose Up
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'artisan', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    trust_score INT DEFAULT 50, -- 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Artisans Profile (Extends Users)
CREATE TABLE artisan_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    bio TEXT,
    location GEOGRAPHY(POINT, 4326),
    hourly_rate_kobo BIGINT,
    availability_status VARCHAR(20) DEFAULT 'available',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table (The core of the system)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    artisan_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    budget_kobo BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'posted', -- posted, funded, assigned, in_progress, submitted, released, disputed, settled, cancelled
    squad_virtual_account VARCHAR(50), -- Virtual NUBAN for this job's escrow
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Double-entry Ledger
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    amount_kobo BIGINT NOT NULL,
    entry_type VARCHAR(20) NOT NULL, -- credit, debit
    account_type VARCHAR(50) NOT NULL, -- escrow, artisan_wallet, client_refund, squad_fee
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Verification Photos
CREATE TABLE job_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    artisan_id UUID NOT NULL REFERENCES users(id),
    photo_urls TEXT[] NOT NULL,
    note TEXT,
    ai_verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, flagged
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_artisan_location ON artisan_profiles USING GIST(location);
CREATE INDEX idx_job_location ON jobs USING GIST(location);
CREATE INDEX idx_job_status ON jobs(status);
CREATE INDEX idx_user_phone ON users(phone_number);
