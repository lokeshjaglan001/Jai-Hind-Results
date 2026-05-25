import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DeploymentService } from './deployment.service';

@Controller('deployment')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Get()
  getDeploymentPage(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 14px;
        }

        .content {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input[type="password"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
        }

        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }

        .loading.active {
            display: block;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .output {
            display: none;
            margin-top: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .output.active {
            display: block;
        }

        .output h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .command-result {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
        }

        .command-result:last-child {
            margin-bottom: 0;
        }

        .command-title {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 10px;
            font-family: 'Courier New', monospace;
        }

        .command-output {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-x: auto;
        }

        .error {
            color: #dc3545;
        }

        .success {
            color: #28a745;
        }

        .alert {
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .command-list {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .command-list h4 {
            color: #333;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .command-list ol {
            margin-left: 20px;
        }

        .command-list li {
            margin-bottom: 5px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Deployment Panel</h1>
            <p>Haryana Job Alert Backend</p>
        </div>
        
        <div class="content">
            <div class="command-list">
                <h4>Commands to be executed:</h4>
                <ol>
                    <li>git pull</li>
                    <li>npm run build</li>
                    <li>pm2 restart haryana-job-alert-backend</li>
                </ol>
            </div>

            <form id="deploymentForm">
                <div class="form-group">
                    <label for="secretKey">Secret Key</label>
                    <input 
                        type="password" 
                        id="secretKey" 
                        name="secretKey" 
                        placeholder="Enter deployment secret key"
                        required
                    >
                </div>
                
                <button type="submit" class="btn" id="submitBtn">
                    Deploy Now
                </button>
            </form>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Running deployment commands... Please wait...</p>
            </div>

            <div class="output" id="output"></div>
        </div>
    </div>

    <script>
        const form = document.getElementById('deploymentForm');
        const loading = document.getElementById('loading');
        const output = document.getElementById('output');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const secretKey = document.getElementById('secretKey').value;
            
            // Reset UI
            output.innerHTML = '';
            output.classList.remove('active');
            loading.classList.add('active');
            submitBtn.disabled = true;

            try {
                const response = await fetch('/deployment/deploy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ secretKey }),
                });

                const data = await response.json();

                loading.classList.remove('active');

                if (!response.ok) {
                    output.innerHTML = \`
                        <div class="alert alert-error">
                            <strong>Error:</strong> \${data.message || 'Deployment failed'}
                        </div>
                    \`;
                    output.classList.add('active');
                    submitBtn.disabled = false;
                    return;
                }

                // Display results
                let html = \`
                    <div class="alert alert-\${data.success ? 'success' : 'error'}">
                        <strong>\${data.success ? '✅ Deployment Successful!' : '❌ Deployment Failed'}</strong>
                    </div>
                    <h3>Command Outputs:</h3>
                \`;

                data.outputs.forEach(cmd => {
                    html += \`
                        <div class="command-result">
                            <div class="command-title">$ \${cmd.command}</div>
                            <div class="command-output">\${cmd.output || 'No output'}\${cmd.error ? '\\n\\nError:\\n' + cmd.error : ''}</div>
                        </div>
                    \`;
                });

                output.innerHTML = html;
                output.classList.add('active');
                submitBtn.disabled = false;

            } catch (error) {
                loading.classList.remove('active');
                output.innerHTML = \`
                    <div class="alert alert-error">
                        <strong>Error:</strong> \${error.message || 'Failed to connect to server'}
                    </div>
                \`;
                output.classList.add('active');
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
    `;

    res.status(HttpStatus.OK).header('Content-Type', 'text/html').send(html);
  }

  @Post('deploy')
  async deploy(@Body('secretKey') secretKey: string) {
    try {
      if (!secretKey) {
        throw new UnauthorizedException('Secret key is required');
      }

      const isValid = this.deploymentService.validateSecretKey(secretKey);
      if (!isValid) {
        throw new UnauthorizedException('Invalid secret key');
      }

      console.log('Starting deployment commands...');
      const result = await this.deploymentService.runDeploymentCommands();
      console.log('Deployment completed:', result);
      return result;
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }
}
