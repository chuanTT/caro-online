import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail(
    {
      allow_utf8_local_part: false,
      require_tld: true,
      host_blacklist: ['example.com'],
    },
    { message: 'Email không đúng định dạng' },
  )
  email: string;
}
