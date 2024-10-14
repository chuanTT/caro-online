import { applyMixins } from '../utils/mixin.util';
import { EmailDto } from './email.dto';
import { PasswordDto } from './password.dto';

export class RegisterAuthDtoBase {}

applyMixins(RegisterAuthDtoBase, [PasswordDto, EmailDto]);
