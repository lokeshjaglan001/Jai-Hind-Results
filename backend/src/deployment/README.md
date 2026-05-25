# Deployment Module

This module provides a secure web-based deployment interface for the Haryana Job Alert Backend.

## Features

- Web-based deployment interface accessible via browser
- Secret key authentication
- Executes deployment commands automatically:
  1. `git pull` - Pull latest code from repository
  2. `npm run build` - Build the application
  3. `pm2 restart haryana-job-alert-backend` - Restart the PM2 process
- Real-time command output display
- Error handling and reporting

## Setup

### 1. Add Environment Variable

Add the following to your `.env` file:

```env
DEPLOYMENT_SECRET_KEY=your-super-secret-deployment-key-here
```

**Important:** Use a strong, unique secret key. Keep it secure and never commit it to version control.

### 2. Build and Deploy

After adding the environment variable, rebuild and restart your application:

```bash
npm run build
pm2 restart haryana-job-alert-backend
```

## Usage

### Access the Deployment Page

Navigate to: `http://your-domain.com/deployment`

Or for local development: `http://localhost:3000/deployment`

### Deploy

1. Enter your secret key in the form
2. Click "Deploy Now"
3. Wait for the commands to execute
4. View the output of each command

## API Endpoints

### GET `/deployment`
Returns the HTML deployment interface page.

### POST `/deployment/deploy`
Executes the deployment commands.

**Request Body:**
```json
{
  "secretKey": "your-secret-key"
}
```

**Response (Success):**
```json
{
  "success": true,
  "outputs": [
    {
      "command": "git pull",
      "output": "Already up to date.",
      "error": null
    },
    {
      "command": "npm run build",
      "output": "Build completed successfully",
      "error": null
    },
    {
      "command": "pm2 restart haryana-job-alert-backend",
      "output": "Process restarted",
      "error": null
    }
  ]
}
```

**Response (Error):**
```json
{
  "statusCode": 401,
  "message": "Invalid secret key"
}
```

## Security Considerations

1. **Secret Key Protection:**
   - Use a strong, randomly generated secret key
   - Never share the secret key publicly
   - Store it securely in environment variables
   - Rotate the key periodically

2. **Network Security:**
   - Consider using HTTPS only in production
   - Implement IP whitelisting if needed
   - Add rate limiting to prevent brute force attacks

3. **Access Control:**
   - Limit access to trusted IPs only (via firewall/nginx)
   - Monitor deployment logs for unauthorized attempts

## Troubleshooting

### "DEPLOYMENT_SECRET_KEY is not configured"
Make sure you've added the `DEPLOYMENT_SECRET_KEY` to your `.env` file and restarted the application.

### Commands fail to execute
- Verify that git, npm, and pm2 are installed and accessible
- Check file permissions in the backend directory
- Ensure the application has necessary permissions to execute commands

### PM2 restart fails
- Verify the PM2 process name is exactly `haryana-job-alert-backend`
- Run `pm2 list` to see all running processes
- Update the process name in `deployment.service.ts` if different

## Customization

### Modify Commands

Edit `/src/deployment/deployment.service.ts` and update the `commands` array:

```typescript
const commands = [
  'git pull',
  'npm run build',
  'pm2 restart haryana-job-alert-backend',
  // Add more commands here
];
```

### Change Timeout

Modify the timeout value in `deployment.service.ts`:

```typescript
const { stdout, stderr } = await execAsync(command, {
  cwd: backendDir,
  timeout: 300000, // 5 minutes (in milliseconds)
});
```
