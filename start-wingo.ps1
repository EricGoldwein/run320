# Kill any existing processes on ports 3001 and 5173-5177
$ports = @(3001, 5173, 5174, 5175, 5176, 5177)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Killing process on port $port (PID: $($process.OwningProcess))"
        Stop-Process -Id $process.OwningProcess -Force
    }
}

# Start backend server
Write-Host "Starting backend server..."
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python -m uvicorn main:app --host 0.0.0.0 --port 3001 --reload"

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "Starting frontend server..."
$frontendPath = Join-Path $PSScriptRoot "wingo-bets"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "`nWingo servers are starting up..."
Write-Host "Backend will be available at: http://localhost:3001"

# Wait for frontend to be ready
Start-Sleep -Seconds 10
$frontendPort = 5173  # Default Vite port
Write-Host "Frontend is available at: http://localhost:$frontendPort"

# Open both URLs in default browser
Start-Process "http://localhost:3001/api"
Start-Process "http://localhost:$frontendPort" 