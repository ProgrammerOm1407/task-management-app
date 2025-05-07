@echo off
echo Starting Task Management API server...
start cmd /k "npm start"

echo Waiting for server to start...
timeout /t 5 /nobreak

echo Running API tests...
node test-api.js

echo Running Authentication tests...
node test-auth.js

echo.
echo Tests completed. Server is still running.
echo Press any key to stop the server...
pause > nul

echo Stopping server...
taskkill /f /im node.exe

echo Done!