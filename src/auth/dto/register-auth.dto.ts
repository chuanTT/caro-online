import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, ValidateIf } from 'class-validator';
import { Match } from 'src/common/decorators/math.decorator';

export class RegisterAuthDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Họ và đệm không được để trống' })
  firstName: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Tên không được để trống' })
  lastName: string;

  @IsEmail(
    {
      allow_utf8_local_part: false,
      require_tld: true,
      host_blacklist: ['example.com'],
    },
    { message: 'Email không đúng định dạng' },
  )
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ValidateIf((o) => o.password)
  @Length(8, 128, { message: 'Mật khẩu tối thiểu từ 8 đến 128 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Match('password')
  confirmPassword: string;
}
