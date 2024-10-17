import { PasswordValidationDecorators } from 'src/common/decorators/password.decorator';
import { PasswordDto } from 'src/common/dtos/password.dto';

export class ChangePasswordDto extends PasswordDto {
  @PasswordValidationDecorators('Mật khẩu cũ')
  oldPassword: string;
}
