# Kill any existing processes on ports 3001 and 5173-5177
$ports = @(3001, 5173, 5174, 5175, 5176, 5177)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $processId = $process.OwningProcess
        # Only attempt to kill if PID is valid (non-zero and not a system process)
        if ($processId -gt 0 -and $processId -ne 4) {  # PID 4 is System process
            try {
                $processInfo = Get-Process -Id $processId -ErrorAction Stop
                if ($processInfo.ProcessName -ne "System") {
                    Write-Host "Killing process on port $port (PID: $processId, Name: $($processInfo.ProcessName))"
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                }
            }
            catch [System.Management.Automation.ActionPreferenceStopException] {
                # Process is already terminated
                Write-Host "Process on port $port (PID: $processId) is already terminated"
            }
            catch {
                Write-Host "Could not kill process on port $port (PID: $processId) - $($_.Exception.Message)"
            }
        }
    }
}

# Activate virtual environment and start backend server
Write-Host "Starting backend server..."
$backendPath = Join-Path $PSScriptRoot "backend"
$venvPath = Join-Path $PSScriptRoot ".venv"
$pythonPath = Join-Path $venvPath "Scripts\python.exe"
$requirementsPath = Join-Path $PSScriptRoot "requirements.txt"

if (-not (Test-Path $pythonPath)) {
    Write-Host "Virtual environment not found. Creating one..."
    python -m venv .venv
    & $pythonPath -m pip install -r $requirementsPath
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; & '$pythonPath' -m uvicorn main:app --host 0.0.0.0 --port 3001 --reload"

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