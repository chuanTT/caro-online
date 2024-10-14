import { PickType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from './register-auth.dto';

export class LoginAuthDto extends PickType(RegisterAuthDto, [
  'password',
  'email',
] as const) {}
