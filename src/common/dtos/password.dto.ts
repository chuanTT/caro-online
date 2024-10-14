import { IsNotEmpty, Length, ValidateIf } from 'class-validator';
import { Match } from '../decorators/math.decorator';

export class PasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ValidateIf((o) => o.password)
  @Length(8, 128, { message: 'Mật khẩu tối thiểu từ 8 đến 128 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Match('password')
  confirmPassword: string;
}
