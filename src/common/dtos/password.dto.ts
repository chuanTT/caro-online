import { IsNotEmpty, Length } from 'class-validator';
import { Match } from '../decorators/math.decorator';

export class PasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(8, 128, { message: 'Mật khẩu tối thiểu từ 8 đến 128 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Match('password', { message: 'Mật khẩu không trùng khớp' })
  confirmPassword: string;
}
