import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    // Because of the Guard, the user object is attached to the request
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = (req.user as any).id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }
}