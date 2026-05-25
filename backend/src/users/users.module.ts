import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// PrismaModule is global, no need to import typically

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}