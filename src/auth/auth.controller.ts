import { Body, Controller, Delete, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSignupDto } from './dto/create-signup.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Response } from 'express';
import { RtGuard } from './guard/rt.guard';
import { Cookies } from './decorator/cookies.decorator';
import { DecodedUserType, User } from './decorator/user.decorator';
import { AtGuard } from './guard/at.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupData: CreateSignupDto): Promise<UserResponseDto> {
    return await this.authService.signup(signupData);
  }

  @Post('login')
  async login(@Body() loginData: CreateLoginDto, @Res() res: Response): Promise<UserResponseDto> {
    return await this.authService.login(loginData, res);
  }

  @UseGuards(RtGuard)
  @Get('refresh')
  async refresh(
    @Res() response: Response,
    @Cookies('refreshToken') refreshToken: string,
    @User() user: DecodedUserType,
  ): Promise<void> {
    return await this.authService.refresh(response, refreshToken, user);
  }

  @UseGuards(AtGuard)
  @HttpCode(204)
  @Delete('logout')
  async logout(@User() user: DecodedUserType, @Res() response: Response): Promise<void> {
    return await this.authService.logout(user, response);
  }
}
