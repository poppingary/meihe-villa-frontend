#!/bin/bash
# Manual deployment script for Meihe Villa Frontend
# Run this on EC2 to manually deploy the latest image

set -e

# Configuration
AWS_REGION="${AWS_REGION:-ap-northeast-1}"
ECR_REPOSITORY="${ECR_REPOSITORY:-meihe-villa-frontend}"
CONTAINER_NAME="${CONTAINER_NAME:-meihe-frontend}"
APP_DIR="${APP_DIR:-/opt/meihe-villa}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Meihe Villa Frontend Deployment ===${NC}"

# Get ECR registry
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo -e "${YELLOW}ECR Registry: ${ECR_REGISTRY}${NC}"
echo -e "${YELLOW}Repository: ${ECR_REPOSITORY}${NC}"

# Login to ECR
echo -e "\n${GREEN}Logging in to ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Pull latest image
echo -e "\n${GREEN}Pulling latest image...${NC}"
docker pull $ECR_REGISTRY/$ECR_REPOSITORY:latest

# Stop old container
echo -e "\n${GREEN}Stopping old container...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || echo "No running container to stop"
docker rm $CONTAINER_NAME 2>/dev/null || echo "No container to remove"

# Start new container
echo -e "\n${GREEN}Starting new container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 3000:3000 \
  $ECR_REGISTRY/$ECR_REPOSITORY:latest

# Cleanup old images
echo -e "\n${GREEN}Cleaning up old images...${NC}"
docker image prune -af

# Health check
echo -e "\n${GREEN}Running health check...${NC}"
sleep 5
if curl -sf http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed!${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo -e "\n${GREEN}=== Deployment Complete ===${NC}"
docker ps | grep $CONTAINER_NAME
