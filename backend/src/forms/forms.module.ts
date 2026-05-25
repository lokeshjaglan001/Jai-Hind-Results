// forms.module.ts
import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [FormsController],
  providers: [FormsService, PrismaService, SupabaseService],
})
export class FormsModule {}