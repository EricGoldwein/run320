# WINGO SERVER RULES

## Directory Structure
```
wingo/
├── backend/
│   └── main.py
└── wingo-bets/
    └── ...
```

## Backend Server Rules
1. MUST be run from the `backend` directory
2. Command: `cd backend; python -m uvicorn main:app --reload --host 127.0.0.1 --port 3000`
3. NEVER run from root directory - will get "Error loading ASGI app. Could not import module 'main'"
4. Server will be available at: http://127.0.0.1:3000

## Frontend Server Rules
1. MUST be run from the `wingo-bets` directory
2. Command: `cd wingo-bets; npm run dev`
3. Server will be available at: http://localhost:5173 (or 5174 if 5173 is in use)

## PowerShell Rules
1. NEVER use `&&` in PowerShell - use `;` instead
2. Example: `cd backend; python -m uvicorn main:app --reload --host 127.0.0.1 --port 3000`

## Error Handling
1. If you see "Error loading ASGI app. Could not import module 'main'" - you're in the wrong directory
2. If you see "Port 5173 is in use" - the frontend will automatically use 5174
3. If you see "Cannot find path 'backend/backend'" - you're already in the backend directory

## Common Mistakes
1. Running uvicorn from root directory instead of backend directory
2. Using `&&` instead of `;` in PowerShell
3. Not checking error messages before proceeding
4. Not verifying both servers are running before testing 