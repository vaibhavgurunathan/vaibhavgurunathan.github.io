#!/bin/bash
# Site commit script for .bashrc
# Add this to your ~/.bashrc file to commit and push website updates automatically

if [ -f "index.html" ]; then
    git add .
    git commit -m "Daily log"
    git push
    echo "Everything working as intended"
fi
