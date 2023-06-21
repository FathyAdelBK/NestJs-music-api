import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { DecodedUserType } from '../decorator/user.decorator';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService, private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }

  async validate(payload: { id: number; email: string; role: DecodedUserType }) {
    const { email } = payload;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ForbiddenException('Token is not valid!');
    }
    return payload;
  }
}
