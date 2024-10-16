import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  IPlayloadToken,
  IReturnGenerateToken,
  TGenerateAccessRefreshToken,
} from './interface/auth.interface';
import { UserService } from 'src/user/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { comparePassword } from 'src/common/utils/password.util';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  createAccessToken({ payload, options }: IPlayloadToken) {
    return this.jwtService.signAsync(payload, options);
  }

  createRefreshToken({ payload, options }: IPlayloadToken) {
    return this.jwtService.signAsync(payload, {
      ...options,
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
  }

  payloadToken(user: TGenerateAccessRefreshToken) {
    return {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }

  async generateAccessRefreshToken(
    payload: TGenerateAccessRefreshToken,
  ): Promise<IReturnGenerateToken> {
    const accessToken = await this.createAccessToken({ payload });
    const refreshToken = await this.createRefreshToken({ payload });

    if (refreshToken && payload?.id) {
      await this.userService.updateToken(payload?.id, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  comparePasswordAuth(password: string, hashedPassword: string) {
    const keySecret = this.configService.get('password.secret');
    const newPass = password + keySecret;
    return comparePassword(newPass, hashedPassword);
  }

  async register(payload: RegisterAuthDto) {
    const data = await this.userService.findOneEmail(payload?.email);
    if (data) {
      throw new UnprocessableEntityException(
        'Tài khoản đã tồn tại trong hệ thống',
      );
    }

    const result = await this.userService.create(payload);
    const newPayload = this.payloadToken(result);
    return await this.generateAccessRefreshToken(newPayload);
  }

  async login(payload: LoginAuthDto) {
    const result = await this.userService.findOneEmail(payload?.email);
    const unauthorizedException = new UnauthorizedException(
      'Thông tin đăng nhập không hợp lệ',
    );
    if (!result) {
      throw unauthorizedException;
    }
    const isMatchPassword = this.comparePasswordAuth(
      payload?.password,
      result?.password,
    );
    if (!isMatchPassword) {
      throw unauthorizedException;
    }
    const newPayload = this.payloadToken(result);
    return await this.generateAccessRefreshToken(newPayload);
  }

  async logout(id: string) {
    return this.userService.updateToken(id, null);
  }

  async refresh(user: User) {
    const payload = this.payloadToken(user);
    const accessToken = await this.createAccessToken({ payload });
    return {
      accessToken,
    };
  }
}
