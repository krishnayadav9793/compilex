@echo off
echo ===================================================
echo  CompileX - Building Custom Docker Sandbox Image
echo ===================================================
echo Image Name: compilex-sandbox:latest
echo.

docker build -t compilex-sandbox:latest -f Dockerfile.sandbox .

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build compilex-sandbox Docker image.
    echo Please make sure Docker Desktop is started and running.
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] compilex-sandbox:latest image built successfully!
echo You can now run the backend with full container isolation.
