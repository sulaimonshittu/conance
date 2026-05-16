@echo off
setlocal

REM Resolve the directory this script lives in so it works from any working directory.
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo ============================================================
echo  Starting Conance Backend Services
echo ============================================================

echo.
echo [1/6] Starting Postgres and Redis containers...
docker compose up -d
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start Docker containers. Is Docker Desktop running?
    exit /b 1
)

echo.
echo [2/6] Waiting for database to be ready (10 seconds)...
timeout /t 10 /nobreak > nul

echo.
echo [3/6] Running Database Migrations...
go run github.com/pressly/goose/v3/cmd/goose@latest -dir db/migrations postgres "postgres://conance_user:conance_password@localhost:5432/conance_db?sslmode=disable" up
if %ERRORLEVEL% neq 0 (
    echo ERROR: Migrations failed. Check that the database container is running and reachable.
    exit /b 1
)

echo.
echo [4/6] Seeding Database...
go run scripts/seed.go
if %ERRORLEVEL% neq 0 (
    echo WARNING: Seeding failed. The database may already be seeded, or a migration error occurred above.
)

echo.
echo [5/6] Starting API Server (new window)...
start "Conance API" cmd /k "go run cmd\api\main.go"

echo.
echo [6/6] Starting Background Worker (new window)...
start "Conance Worker" cmd /k "go run cmd\worker\main.go"

echo.
echo ============================================================
echo  All services started. API and Worker are running in
echo  separate terminal windows.
echo ============================================================

endlocal
