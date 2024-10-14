import { OmitType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

export class CreateUserDto extends OmitType(RegisterAuthDto, [
  'confirmPassword',
]) {}
