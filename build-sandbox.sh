#!/bin/bash
set -e

echo "==================================================="
echo " CompileX - Building Custom Docker Sandbox Image"
echo "==================================================="
echo "Image Name: compilex-sandbox:latest"
echo ""

docker build -t compilex-sandbox:latest -f Dockerfile.sandbox .

echo ""
echo "[SUCCESS] compilex-sandbox:latest image built successfully!"
