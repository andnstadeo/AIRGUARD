#!/bin/bash

# AIRGUARD Quick Setup Script for macOS/Linux

echo ""
echo "============================================"
echo "   AIRGUARD Frontend Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found"
node --version
npm --version
echo ""

# Check if already installed
if [ -d "node_modules" ]; then
    echo "Dependencies already installed."
    echo ""
    echo "Running development server..."
    npm run dev
else
    echo "Installing dependencies..."
    echo ""
    npm install
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    
    echo ""
    echo "✓ Installation complete!"
    echo ""
    echo "Starting development server..."
    npm run dev
fi
