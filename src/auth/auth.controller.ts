import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JWTAuthAccessGuard } from './guards/jwt-auth-access.guard';
import { JWTAuthRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { User } from 'src/user/entities/user.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JWTAuthAccessGuard)
  @Get('profile')
  getProfile(@Req() request: Request) {
    return request['user'];
  }

  @Post('login')
  async login(@Body() payload: LoginAuthDto) {
    return await this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: RegisterAuthDto) {
    return await this.authService.register(payload);
  }

  @UseGuards(JWTAuthRefreshGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    const user = request['user'] as User;
    await this.authService.logout(user?.id);
  }

  @UseGuards(JWTAuthRefreshGuard)
  @Post('refresh')
  async getRefresh(@Req() request: Request) {
    const user = request['user'] as User;
    return this.authService.refresh(user);
  }
}
