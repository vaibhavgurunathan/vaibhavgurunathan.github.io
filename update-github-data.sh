#!/bin/bash
# GitHub Data Update Script for .bashrc
# Add this to your ~/.bashrc file to run GitHub data updates automatically

# Check if we're in the website directory
if [ -f "update-github-data.py" ] && [ -f "index.html" ]; then
    echo "🔄 Updating GitHub data for personal website..."
    python3 update-github-data.py
    echo "✅ GitHub data update complete!"
fi
