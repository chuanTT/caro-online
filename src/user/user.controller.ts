import {
  Controller,
  Patch,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/configs/multer.config';
import { covertMBToByte } from 'src/common/utils/file.util';

@UseGuards(JWTAuthAccessGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me')
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      multerConfig({
        allowedMimeTypes: ['jpg', 'jpeg', 'png'],
        maxSize: covertMBToByte(5),
      }),
    ),
  )
  update(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request['user'] as User;
    return this.userService.updateUserMe(user?.id, updateUserDto, file);
  }

  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const user = request['user'] as User;
    await this.userService.changePassword(user?.id, changePasswordDto);
  }
}
