import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() request) {
    return request.user;
  }

  @Post('login')
  async login(@Body() payload: LoginAuthDto) {
    return await this.authService.login(payload);
  }

  @Post('register')
  async register(@Body() payload: RegisterAuthDto) {
    return await this.authService.register(payload);
  }
}
