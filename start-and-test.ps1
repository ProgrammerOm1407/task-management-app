# Start the server in a new PowerShell window
Write-Host "Starting Task Management API server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm start"

# Wait for the server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Run the API tests
Write-Host "Running API tests..." -ForegroundColor Cyan
node test-api.js

# Run the Authentication tests
Write-Host "Running Authentication tests..." -ForegroundColor Cyan
node test-auth.js

Write-Host "`nTests completed. Server is still running." -ForegroundColor Green
Write-Host "Press any key to stop the server..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop the Node.js processes
Write-Host "Stopping server..." -ForegroundColor Yellow
Get-Process -Name "node" | Stop-Process -Force

Write-Host "Done!" -ForegroundColor Green