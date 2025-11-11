#!/bin/bash

echo "================================================"
echo "    Việt Sử Ký - Starting Application"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 is not installed!"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

echo "[OK] Python detected"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "[INFO] Virtual environment not found. Creating..."
    python3 -m venv venv
    echo "[OK] Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "[INFO] Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
if ! python -c "import streamlit" &> /dev/null; then
    echo "[INFO] Installing requirements..."
    pip install -r requirements.txt
    echo "[OK] Requirements installed"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "[WARNING] .env file not found!"
    echo "Please create .env file from .env.example and add your API keys."
    echo ""
    read -p "Do you want to continue anyway? (y/n) " continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        echo "Exiting..."
        exit 0
    fi
fi

# Run Streamlit
echo ""
echo "================================================"
echo "    Starting Việt Sử Ký..."
echo "    App will open at: http://localhost:8501"
echo "================================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

streamlit run app.py
