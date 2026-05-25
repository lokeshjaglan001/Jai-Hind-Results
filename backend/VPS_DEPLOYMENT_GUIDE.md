# VPS Deployment Guide

## Steps to Deploy on Your VPS

### 1. SSH into your VPS
```bash
ssh root@your-vps-ip
```

### 2. Navigate to the backend directory
```bash
cd /root/Clients/haryana-job-alert/backend
```

### 3. Pull the latest code
```bash
git pull
```

### 4. Install dependencies (if needed)
```bash
npm install
```

### 5. Build the application
```bash
npm run build
```

### 6. Check if PM2 is running
```bash
pm2 list
```

You should see `haryana-job-alert-backend` in the list.

### 7. Restart PM2
```bash
pm2 restart haryana-job-alert-backend
```

Or if it's not running, start it:
```bash
pm2 start dist/main.js --name haryana-job-alert-backend
```

### 8. Check PM2 logs to verify everything is working
```bash
pm2 logs haryana-job-alert-backend --lines 50
```

Look for:
- No errors
- "Running deployment commands in directory:" log should show `/root/Clients/haryana-job-alert/backend/dist`
- Server should be listening on the configured port

### 9. Save PM2 configuration
```bash
pm2 save
```

## Testing the Deployment Endpoint

### From your browser:
Visit: `https://haryana-job-alerts-backend.softricity.in/deployment`

Enter your secret key: `F4amc0m2hnPBGhTkYXInpmS3WiFFFruz`

### Using curl:
```bash
curl -X POST https://haryana-job-alerts-backend.softricity.in/deployment/deploy \
  -H "Content-Type: application/json" \
  -d '{"secretKey":"F4amc0m2hnPBGhTkYXInpmS3WiFFFruz"}'
```

## Troubleshooting 502 Bad Gateway

### Check if backend is running:
```bash
pm2 status
```

### Check PM2 logs for errors:
```bash
pm2 logs haryana-job-alert-backend --err --lines 100
```

### Check if the port is correct in nginx:
```bash
cat /etc/nginx/sites-available/haryana-job-alert-backend
```

The proxy_pass should point to the correct port (likely 5003 based on your .env).

### Restart nginx if needed:
```bash
sudo systemctl restart nginx
```

### Common Issues:

1. **Backend crashed during deployment**
   - Check logs: `pm2 logs`
   - Restart: `pm2 restart haryana-job-alert-backend`

2. **Nginx can't connect to backend**
   - Verify backend is running on port 5003: `netstat -tlnp | grep 5003`
   - Check nginx config points to correct port
   - Restart nginx: `sudo systemctl restart nginx`

3. **Permission issues with commands**
   - Ensure git, npm, and pm2 are in PATH for the user running PM2
   - Check file permissions: `ls -la /root/Clients/haryana-job-alert/backend`

4. **Environment variables not loaded**
   - Verify .env file exists: `cat /root/Clients/haryana-job-alert/backend/.env`
   - PM2 should load .env automatically, but you can specify it:
     ```bash
     pm2 restart haryana-job-alert-backend --update-env
     ```

## Monitoring

### Real-time logs:
```bash
pm2 logs haryana-job-alert-backend
```

### Check memory usage:
```bash
pm2 monit
```

### Get detailed info:
```bash
pm2 info haryana-job-alert-backend
```

## Security Recommendations

1. **Change the secret key** to something more secure if you haven't already
2. **Restrict access** to /deployment endpoint via nginx by IP:
   ```nginx
   location /deployment {
       allow YOUR_IP_ADDRESS;
       deny all;
       proxy_pass http://localhost:5003;
   }
   ```

3. **Enable HTTPS** (looks like you already have it!)

4. **Monitor logs** regularly for unauthorized attempts

## Quick Deploy After Setup

Once everything is working, you can deploy from the web interface:

1. Visit: https://haryana-job-alerts-backend.softricity.in/deployment
2. Enter secret key: `F4amc0m2hnPBGhTkYXInpmS3WiFFFruz`
3. Click "Deploy Now"
4. Wait for commands to complete

The system will automatically:
- Pull latest code from git
- Build the application
- Restart PM2 process
