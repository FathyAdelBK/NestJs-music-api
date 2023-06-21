import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSignupDto } from './dto/create-signup.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { verify, hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { DecodedUserType } from './decorator/user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  private selectedUser = {
    id: true,
    name: true,
    email: true,
    password: true,
    role: true,
    facebookId: true,
    gmailId: true,
    playlists: { select: { name: true }, take: 1 },
  };

  private async signAccessToken(id: number, email: string, roles: Role): Promise<string> {
    const payload = { id, email, roles };
    return await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: 60 * 15,
    });
  }

  private async signRefreshToken(id: number, email: string, roles: Role): Promise<string> {
    const payload = { id, email, roles };
    return await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: 60 * 60 * 24 * 7,
    });
  }

  private async signCookies(response: Response, accessToken: string, refreshToken: string): Promise<void> {
    await response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    await response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async findByEmail(email: string): Promise<UserResponseDto> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: this.selectedUser,
    });
  }

  async signup(signupData: CreateSignupDto): Promise<UserResponseDto> {
    const { email, password } = signupData;

    const isUserExist = await this.findByEmail(email);
    if (isUserExist) {
      throw new ForbiddenException('Email already taken');
    }

    const hashedPassword = await hash(password);

    signupData.password = hashedPassword;
    signupData.email = email;

    const user = await this.prisma.user.create({
      data: signupData,
      select: this.selectedUser,
    });

    delete user.password;
    return user;
  }

  async login(loginData: CreateLoginDto, response: Response): Promise<UserResponseDto> {
    const { email, password } = loginData;

    const user = await this.findByEmail(email);
    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw new ForbiddenException('Password is not valid!');
    }

    const accessToken = await this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.signRefreshToken(user.id, user.email, user.role);

    await this.signCookies(response, accessToken, refreshToken);
    await this.updateRefreshToken(user.id, refreshToken);

    delete user.password;

    response.json(user);

    return user;
  }

  async refresh(response: Response, refreshTokenCookie: string, decodedUser: DecodedUserType): Promise<void> {
    const { email } = decodedUser;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    const isValidRefreshToken = await verify(user.refreshToken, refreshTokenCookie);
    if (!isValidRefreshToken) {
      throw new ForbiddenException('Token is not valid!');
    }

    const accessToken = await this.signAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.signRefreshToken(user.id, user.email, user.role);

    await this.signCookies(response, accessToken, refreshToken);
    await this.updateRefreshToken(user.id, refreshToken);

    response.send('Refresh token successfully!');
  }

  async logout(decodedUser: DecodedUserType, response: Response): Promise<void> {
    const { email } = decodedUser;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    await response.clearCookie('accessToken');
    await response.clearCookie('refreshToken');

    response.end();
  }
}
