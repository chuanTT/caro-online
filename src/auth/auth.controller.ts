import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() payload: RegisterAuthDto) {
    const data = this.userService.findOneEmail(payload?.email);
    console.log(data);
    // return this.userService.create(createUserDto);
  }
}
