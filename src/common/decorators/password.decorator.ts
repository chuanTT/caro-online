import { IsNotEmpty, Length } from 'class-validator';

export function PasswordValidationDecorators(str = 'Mật khẩu') {
  return function (target: any, propertyKey: string) {
    IsNotEmpty({ message: `${str} không được để trống` })(target, propertyKey);
    Length(8, 128, { message: `${str} tối thiểu từ 8 đến 128 ký tự` })(
      target,
      propertyKey,
    );
  };
}
