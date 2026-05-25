import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // This method is called by Passport after it verifies the token's signature
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
      include: {
        mock_attempts: {
          include: {
            mock_tests: {
              select: {
                title: true,
                mock_questions: {
                  select: {
                    marks: true,
                  },
                },
              },
            },
          },
          orderBy: {
            completed_at: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password_hash, ...result } = user;
    return result;
  }
}