#!/bin/bash
# EC2 Initial Setup Script for Meihe Villa Frontend
# Run this script on a fresh Amazon Linux 2023 or Ubuntu EC2 instance

set -e

echo "=== Meihe Villa EC2 Setup ==="

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
fi

echo "Detected OS: $OS"

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    if [[ "$OS" == *"Amazon Linux"* ]]; then
        sudo yum update -y
        sudo yum install -y docker
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
    elif [[ "$OS" == *"Ubuntu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        sudo usermod -aG docker $USER
    fi
    echo "Docker installed successfully!"
else
    echo "Docker is already installed"
fi

# Install AWS CLI
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
    echo "AWS CLI installed successfully!"
else
    echo "AWS CLI is already installed"
fi

# Install Docker Compose (standalone)
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully!"
else
    echo "Docker Compose is already installed"
fi

# Create app directory
sudo mkdir -p /opt/meihe-villa
sudo chown $USER:$USER /opt/meihe-villa

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Copy docker-compose.prod.yml to /opt/meihe-villa/"
echo "3. Create .env file with production values"
echo "4. Log out and log back in for Docker group changes to take effect"
echo ""
