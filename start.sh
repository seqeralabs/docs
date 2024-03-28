#!/bin/bash

if [ -d "$HOME/.nvm" ]; then
  echo "NVM is installed"
else
  echo "Installing NVM"
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
fi

# Access nvm from this script
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 

# Install node & node packages
nvm install
npm install

# Run on port 3001 (to avoid potential conflict with Docker)
npm run start -- --port 3001