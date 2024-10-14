import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { EmailDto } from 'src/common/dtos/email.dto';
import { PasswordDto } from 'src/common/dtos/password.dto';
export class RegisterAuthDto extends IntersectionType(PasswordDto, EmailDto) {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Họ và đệm không được để trống' })
  firstName: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Tên không được để trống' })
  lastName: string;
}
