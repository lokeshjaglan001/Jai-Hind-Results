import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, SupabaseService],
})
export class FilesModule {}