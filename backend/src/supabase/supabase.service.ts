// src/supabase/supabase.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseUrl: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('FATAL: Supabase URL or Key not found in .env');
      throw new InternalServerErrorException('Supabase URL or Key not provided in .env');
    }

    this.supabaseUrl = supabaseUrl;
    
    this.supabase = createClient(this.supabaseUrl, supabaseKey);
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    path: string,
  ): Promise<string> {
    // SAFE FILE NAME
    const safeFileName = encodeURIComponent(file.originalname);

    const fileName = `${path}/${Date.now()}-${safeFileName}`;

    const formData = new FormData();

    formData.append(
      'file',
      new Blob([new Uint8Array(file.buffer)]),
      safeFileName,
    );

    const uploadUrl = `${this.supabaseUrl}/object/${bucket}/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.configService.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new InternalServerErrorException(
        `Failed to upload file to Supabase: ${errorText}`,
      );
    }

    return `https://supabase.theharyanajobalert.com/storage/v1/object/public/${bucket}/${fileName}`;
  }
}