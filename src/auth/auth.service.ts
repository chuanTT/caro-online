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

  async generateAccessRefreshToken(
    payload: TGenerateAccessRefreshToken,
  ): Promise<IReturnGenerateToken> {
    return {
      accessToken: await this.createAccessToken({ payload }),
      refreshToken: await this.createRefreshToken({ payload }),
    };
  }

  async register(payload: RegisterAuthDto) {
    const data = await this.userService.findOneEmail(payload?.email);
    if (data) {
      throw new UnprocessableEntityException(
        'Tài khoản đã tồn tại trong hệ thống',
      );
    }

    const result = await this.userService.create(payload);
    const generateToken = await this.generateAccessRefreshToken({
      uuid: result.uuid,
      firstName: result.firstName,
      lastName: result.lastName,
    });
    await this.userService.updateToken(
      result?.uuid,
      generateToken?.refreshToken,
    );
    return generateToken;
  }

  async login(payload: LoginAuthDto) {
    const result = await this.userService.findOneEmail(payload?.email);
    const unauthorizedException = new UnauthorizedException(
      'Thông tin đăng nhập không hợp lệ',
    );
    if (!result) {
      throw unauthorizedException;
    }
    const keySecret = this.configService.get('password.secret');
    const newPass = payload?.password + keySecret;
    const isMatchPassword = comparePassword(newPass, result?.password);
    if (!isMatchPassword) {
      throw unauthorizedException;
    }
    const generateToken = await this.generateAccessRefreshToken({
      uuid: result?.uuid,
      firstName: result?.firstName,
      lastName: result?.lastName,
    });

    await this.userService.updateToken(
      result?.uuid,
      generateToken?.refreshToken,
    );
    return generateToken;
  }
}
