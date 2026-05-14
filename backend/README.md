# Conance Backend

This is the backend repository for the Conance project.

## Prerequisites
- **Go 1.22+**
- **Docker Desktop** (must be running in the background)

## How to Run

Running the project is incredibly simple. We have created an automated startup script for Windows.

Just open your terminal in the `backend` folder and run:
```cmd
.\start.bat
```

**This script automatically handles everything for you:**
1. Starts Postgres and Redis via Docker Desktop.
2. Applies the necessary database migrations.
3. Seeds the database with test users for the demo.
4. Opens a new terminal window running the API Server.
5. Opens a new terminal window running the Background Worker.

## Testing the API
Check out the `docs/DEMO.md` file for step-by-step API requests to test the entire escrow flow!
