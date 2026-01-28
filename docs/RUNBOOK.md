# Operations Runbook

Deployment procedures, monitoring, common issues, and rollback procedures for the Meihe Villa frontend.

## Deployment Procedures

### Automatic Deployment (CI/CD)

Push to `main` branch triggers automatic deployment via GitHub Actions:

```bash
git push origin main
```

**Pipeline Steps:**
1. Build Docker image
2. Push to Amazon ECR
3. SSH to EC2 and pull new image
4. Restart container with zero-downtime

### Manual Deployment

SSH into EC2 and run:

```bash
cd /opt/meihe-villa
./deploy.sh
```

### Deployment Verification

After deployment, verify:

```bash
# Check container status
docker ps

# Health check
curl http://localhost:3000

# Check logs for errors
docker logs -f meihe-frontend --tail 100
```

## Monitoring and Alerts

### Application Logs

```bash
# Follow live logs
docker logs -f meihe-frontend

# Last 100 lines
docker logs --tail 100 meihe-frontend

# Nginx logs (if enabled)
docker logs -f meihe-nginx
```

### Container Health

```bash
# Container status
docker ps

# Resource usage
docker stats

# Check if container is running
docker inspect meihe-frontend --format='{{.State.Status}}'
```

### System Health

```bash
# Disk usage
df -h

# Memory usage
free -m

# CPU usage
top
```

### Health Check Endpoints

| Endpoint | Expected Response |
|----------|-------------------|
| `http://localhost:3000` | 200 OK (Homepage) |
| `http://localhost:3000/api/health` | 200 OK (if implemented) |

## Common Issues and Fixes

### Container Not Starting

**Symptoms:** `docker ps` shows no running container

**Diagnosis:**
```bash
docker logs meihe-frontend
docker inspect meihe-frontend
```

**Solutions:**
1. Check for port conflicts:
   ```bash
   sudo lsof -i :3000
   ```
2. Restart container:
   ```bash
   docker restart meihe-frontend
   ```
3. Rebuild and restart:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --force-recreate
   ```

### ECR Login Failed

**Symptoms:** "no basic auth credentials" or "access denied"

**Solution:**
```bash
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### Out of Disk Space

**Symptoms:** Build fails, container won't start

**Diagnosis:**
```bash
df -h
docker system df
```

**Solution:**
```bash
# Clean unused Docker resources
docker system prune -af
docker volume prune -f

# Remove old images
docker image prune -a
```

### API Connection Failed

**Symptoms:** Frontend loads but API calls fail

**Diagnosis:**
```bash
# Check backend is reachable
curl http://backend-host:8000/api/v1/health

# Check environment variables
docker exec meihe-frontend env | grep API
```

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend container is running
3. Verify network connectivity between containers

### High Memory Usage

**Symptoms:** Container OOM killed, slow response

**Diagnosis:**
```bash
docker stats meihe-frontend
```

**Solutions:**
1. Increase container memory limit in docker-compose
2. Restart container:
   ```bash
   docker restart meihe-frontend
   ```
3. Check for memory leaks in application

### SSL Certificate Expired

**Symptoms:** HTTPS not working, browser security warnings

**Solution:**
```bash
# Renew Let's Encrypt certificate
docker run -it --rm \
    -v /opt/meihe-villa/nginx/certbot/conf:/etc/letsencrypt \
    -v /opt/meihe-villa/nginx/certbot/www:/var/www/certbot \
    certbot/certbot renew

# Restart nginx
docker restart meihe-nginx
```

## Rollback Procedures

### Quick Rollback (Previous Image)

```bash
# List available images
docker images | grep meihe-frontend

# Stop current container
docker stop meihe-frontend

# Start with previous image tag
docker run -d --name meihe-frontend-rollback \
    -p 3000:3000 \
    -e NEXT_PUBLIC_API_URL=<api-url> \
    <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/meihe-frontend:<previous-tag>

# Verify rollback works
curl http://localhost:3000

# Remove old container and rename
docker rm meihe-frontend
docker rename meihe-frontend-rollback meihe-frontend
```

### Git Rollback

If the issue is in the code:

```bash
# On local machine
git revert HEAD
git push origin main
# Wait for CI/CD to deploy
```

Or deploy specific commit:

```bash
# On EC2
docker pull <ecr-url>/meihe-frontend:<commit-sha>
docker-compose -f docker-compose.prod.yml up -d
```

### Emergency Rollback

If everything is broken:

```bash
# Stop all containers
docker stop $(docker ps -q)

# Pull known-good image
docker pull <ecr-url>/meihe-frontend:v1.0.0

# Start with minimal config
docker run -d -p 3000:3000 --name meihe-frontend \
    -e NEXT_PUBLIC_API_URL=http://backend:8000 \
    <ecr-url>/meihe-frontend:v1.0.0
```

## Maintenance Windows

### Scheduled Maintenance

1. Notify stakeholders
2. Enable maintenance page (if available)
3. Perform maintenance
4. Verify functionality
5. Disable maintenance page
6. Monitor for issues

### Database Migrations

Coordinate with backend team - frontend should be backward compatible with both old and new API versions during migration window.

## Incident Response

### P1 - Site Down

1. Check container status: `docker ps`
2. Check logs: `docker logs meihe-frontend`
3. Attempt restart: `docker restart meihe-frontend`
4. If fails, rollback to previous version
5. Escalate if unresolved in 15 minutes

### P2 - Partial Outage

1. Identify affected functionality
2. Check relevant logs
3. Apply targeted fix or disable feature
4. Plan proper fix for next deployment

### P3 - Performance Degradation

1. Check resource usage: `docker stats`
2. Check for traffic spike
3. Consider scaling or caching improvements
4. Schedule fix for next sprint

## Contact Information

- **Backend Team:** (coordinate for API issues)
- **AWS Support:** (for infrastructure issues)
- **GitHub Actions:** (check workflow runs at github.com/poppingary/meihe-villa-frontend/actions)
