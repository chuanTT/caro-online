import { JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

export interface IPlayloadToken {
  payload: Partial<User>;
  options?: JwtSignOptions;
}

export type TGenerateAccessRefreshToken = Omit<
  IPlayloadToken,
  'options'
>['payload'];

export interface IReturnGenerateToken {
  accessToken: string;
  refreshToken: string;
}
