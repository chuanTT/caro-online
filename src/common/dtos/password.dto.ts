import { Match } from '../decorators/math.decorator';
import { PasswordValidationDecorators } from '../decorators/password.decorator';

export class PasswordDto {
  @PasswordValidationDecorators()
  password: string;

  @PasswordValidationDecorators('Xác nhận mật khẩu')
  @Match('password', { message: 'Mật khẩu không trùng khớp' })
  confirmPassword: string;
}
