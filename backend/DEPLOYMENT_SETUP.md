# Deployment Setup Instructions

## Quick Start Guide

### 1. Add Secret Key to Environment

Create or update your `.env` file in the `backend` folder:

```bash
# In backend/.env
DEPLOYMENT_SECRET_KEY=your-super-secret-key-change-this-to-something-secure
```

**⚠️ Important:** Replace `your-super-secret-key-change-this-to-something-secure` with a strong, unique key.

### 2. Rebuild the Application

```bash
cd backend
npm run build
```

### 3. Restart the Application

```bash
pm2 restart haryana-job-alert-backend
```

### 4. Access the Deployment Page

Open your browser and navigate to:
- Production: `http://your-vps-ip:3000/deployment` or `https://your-domain.com/deployment`
- Local: `http://localhost:3000/deployment`

### 5. Deploy

1. Enter your secret key (the one you set in `.env`)
2. Click "Deploy Now"
3. Watch the commands execute in real-time

## What Gets Executed

When you submit the deployment form, the following commands run automatically in the backend folder:

1. **`git pull`** - Pulls the latest code from the repository
2. **`npm run build`** - Builds the NestJS application
3. **`pm2 restart haryana-job-alert-backend`** - Restarts the PM2 process

## Files Created

- `src/deployment/deployment.module.ts` - NestJS module
- `src/deployment/deployment.controller.ts` - HTTP endpoints and HTML page
- `src/deployment/deployment.service.ts` - Business logic for running commands
- `src/deployment/README.md` - Detailed documentation
- `.env.example` - Example environment configuration

## Security Tips

1. **Keep your secret key secure** - Don't share it or commit it to git
2. **Use HTTPS in production** - Encrypt the secret key in transit
3. **Restrict access** - Use firewall rules or nginx to limit access by IP
4. **Monitor logs** - Check for unauthorized deployment attempts
5. **Rotate keys** - Change the secret key periodically

## Testing Locally

Before deploying to VPS, test locally:

```bash
# 1. Add secret key to .env
echo "DEPLOYMENT_SECRET_KEY=test-key-123" >> .env

# 2. Start the dev server
npm run start:dev

# 3. Open browser
open http://localhost:3000/deployment

# 4. Enter "test-key-123" and test
```

## Troubleshooting

**Commands not executing?**
- Check that git, npm, and pm2 are installed and in PATH
- Verify file permissions in the backend directory
- Check the PM2 process name: `pm2 list`

**"Invalid secret key" error?**
- Verify the key in `.env` matches what you're entering
- Restart the application after changing `.env`

**Connection refused?**
- Ensure the backend is running
- Check firewall rules allow access to port 3000
- Verify CORS settings in `main.ts`

## Next Steps

Consider adding:
- Rate limiting to prevent brute force attacks
- IP whitelisting for additional security
- Slack/Discord notifications on deployment
- Deployment history logging
- Rollback functionality
