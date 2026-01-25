# Meihe Villa Frontend - AWS EC2 Deployment Guide

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│  GitHub     │────▶│   Amazon    │
│   (Code)    │     │  Actions    │     │    ECR      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────┐
                    │            AWS EC2                   │
                    │  ┌─────────┐     ┌───────────────┐  │
                    │  │  Nginx  │────▶│  Next.js App  │  │
                    │  │  (443)  │     │    (3000)     │  │
                    │  └─────────┘     └───────────────┘  │
                    └─────────────────────────────────────┘
```

## Prerequisites

- AWS Account with IAM permissions for ECR and EC2
- GitHub repository
- Domain name (optional, for SSL)

## Step 1: AWS Setup

### 1.1 Create ECR Repository

```bash
# Login to AWS CLI
aws configure

# Create ECR repository
aws ecr create-repository \
    --repository-name meihe-villa-frontend \
    --region ap-northeast-1
```

### 1.2 Create EC2 Instance

1. Launch EC2 instance:
   - AMI: Amazon Linux 2023 or Ubuntu 22.04
   - Instance type: t3.small (minimum)
   - Storage: 20GB gp3
   - Security Group: Allow ports 22, 80, 443, 3000

2. SSH into instance and run setup:
```bash
# Copy and run the setup script
scp scripts/ec2-setup.sh ec2-user@<EC2_IP>:~/
ssh ec2-user@<EC2_IP>
chmod +x ec2-setup.sh
./ec2-setup.sh
```

### 1.3 Configure AWS Credentials on EC2

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Region: ap-northeast-1
# Output format: json
```

## Step 2: GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM user access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key | `wJalr...` |
| `EC2_HOST` | EC2 public IP or domain | `54.123.45.67` |
| `EC2_USERNAME` | SSH username | `ec2-user` or `ubuntu` |
| `EC2_SSH_KEY` | EC2 private key (PEM content) | `-----BEGIN RSA...` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.meihe-villa.tw` |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL | `https://meihe-villa.tw` |
| `NEXT_PUBLIC_SITE_NAME` | Site name | `梅鶴山莊 \| Meihe Villa` |

### Generate SSH Key

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f meihe-ec2-key

# Copy public key to EC2
ssh-copy-id -i meihe-ec2-key.pub ec2-user@<EC2_IP>

# Add private key content to GitHub secret EC2_SSH_KEY
cat meihe-ec2-key
```

## Step 3: IAM Policy

Create IAM user with this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload"
            ],
            "Resource": "*"
        }
    ]
}
```

## Step 4: Deploy

### Automatic Deployment

Push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Manual Deployment

SSH into EC2 and run:

```bash
cd /opt/meihe-villa
./deploy.sh
```

## Step 5: SSL Setup (Optional)

### Using Let's Encrypt with Nginx

1. Copy nginx config:
```bash
scp -r nginx/ ec2-user@<EC2_IP>:/opt/meihe-villa/
scp docker-compose.prod.yml ec2-user@<EC2_IP>:/opt/meihe-villa/
```

2. Update `nginx/nginx.conf` with your domain

3. Get SSL certificate:
```bash
# First time setup (HTTP only)
docker run -it --rm \
    -v /opt/meihe-villa/nginx/certbot/conf:/etc/letsencrypt \
    -v /opt/meihe-villa/nginx/certbot/www:/var/www/certbot \
    certbot/certbot certonly --webroot \
    -w /var/www/certbot \
    -d your-domain.com \
    --email your-email@example.com \
    --agree-tos
```

4. Start with Nginx:
```bash
docker-compose -f docker-compose.prod.yml --profile with-nginx up -d
```

## Monitoring

### View Logs

```bash
# Application logs
docker logs -f meihe-frontend

# Nginx logs (if enabled)
docker logs -f meihe-nginx
```

### Health Check

```bash
curl http://localhost:3000
```

### Container Status

```bash
docker ps
docker stats
```

## Troubleshooting

### Container not starting

```bash
# Check logs
docker logs meihe-frontend

# Check if port is in use
sudo lsof -i :3000
```

### ECR login failed

```bash
# Re-authenticate
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### Out of disk space

```bash
# Clean up Docker
docker system prune -af
docker volume prune -f
```

## Cost Estimation (USD/month)

| Resource | Specification | Estimated Cost |
|----------|---------------|----------------|
| EC2 | t3.small | ~$15 |
| ECR | 1GB storage | ~$0.10 |
| Data Transfer | 10GB | ~$1 |
| **Total** | | **~$16/month** |

## Security Checklist

- [ ] EC2 Security Group: Only allow necessary ports
- [ ] Use IAM roles instead of access keys when possible
- [ ] Enable AWS CloudTrail for auditing
- [ ] Set up CloudWatch alarms for monitoring
- [ ] Regularly update Docker images
- [ ] Use secrets manager for sensitive data
- [ ] Enable VPC Flow Logs
