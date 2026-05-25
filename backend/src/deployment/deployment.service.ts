import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class DeploymentService {
  constructor(private configService: ConfigService) {}

  validateSecretKey(secretKey: string): boolean {
    const validSecretKey = this.configService.get<string>('DEPLOYMENT_SECRET_KEY');
    if (!validSecretKey) {
      throw new Error('DEPLOYMENT_SECRET_KEY is not configured in environment variables');
    }
    return secretKey === validSecretKey;
  }

  async runDeploymentCommands(): Promise<{
    success: boolean;
    outputs: { command: string; output: string; error?: string }[];
  }> {
    const backendDir = path.resolve(__dirname, '../..');
    const outputs: { command: string; output: string; error?: string }[] = [];

    const safeExec = async (command: string) => {
      try {
        const { stdout, stderr } = await execAsync(command, {
          cwd: backendDir,
          timeout: 300000,
          shell: '/bin/bash',
        });
        outputs.push({ command, output: stdout || 'Command executed successfully', error: stderr || undefined });
      } catch (error: any) {
        outputs.push({ command, output: error.stdout || '', error: error.stderr || error.message });
        throw new Error(`${command} failed`);
      }
    };

    try {
      console.log('Executing deployment in:', backendDir);
      await safeExec('git pull');
      await safeExec('npm install');
      await safeExec('npx prisma generate');
      await safeExec('npm run build');

      // ✅ Return response before restarting
      setTimeout(async () => {
        try {
          console.log('Restarting PM2 process in background...');
          await execAsync('pm2 restart haryana-job-alert-backend', {
            cwd: backendDir,
            shell: '/bin/bash',
          });
          console.log('PM2 restart completed');
        } catch (err) {
          console.error('PM2 restart failed:', err);
        }
      }, 2000); // wait a bit so response is flushed

      return {
        success: true,
        outputs,
      };
    } catch (err) {
      return {
        success: false,
        outputs,
      };
    }
  }
}
