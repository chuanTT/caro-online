import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() payload: RegisterAuthDto) {
    const data = await this.userService.findOneEmail(payload?.email);
    if (data) {
      throw new UnprocessableEntityException(
        'Tài khoản đã tồn tại trong hệ thống',
      );
    }
    const result = await this.userService.create(payload);
    return result;
  }
}
