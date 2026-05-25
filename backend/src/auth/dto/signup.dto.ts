import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}