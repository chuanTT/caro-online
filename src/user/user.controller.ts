import { Controller, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JWTAuthAccessGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me')
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = request['user'] as User;
    return this.userService.updateUserMe(user?.id, updateUserDto);
  }

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    console.log(changePasswordDto);
  }
}
