import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
// The import for user_role is no longer strictly needed here for value assignment
// but can be kept for type safety if you use it elsewhere.

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, full_name } = signupDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        email,
        full_name,
        password_hash: hashedPassword,
        role: 'student',
      },
    });

    // Don't return the password hash
    const { password_hash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Check if user exists
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // If email is being updated, check if it's already taken by another user
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email is already taken by another user.');
      }
    }

    // Update the user profile
    const updatedUser = await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: {
        ...(updateProfileDto.full_name && { full_name: updateProfileDto.full_name }),
        ...(updateProfileDto.email && { email: updateProfileDto.email }),
      },
    });

    // Don't return the password hash
    const { password_hash, ...result } = updatedUser;
    return result;
  }
}