import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { user_role } from '../../../generated/prisma'; // Import the enum from Prisma

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(user_role) // Use the enum for role validation
  @IsOptional()
  role?: user_role;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  @IsOptional()
  password?: string; // If provided, the service will hash this
}