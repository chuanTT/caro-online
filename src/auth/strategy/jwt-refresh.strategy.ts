import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TGenerateAccessRefreshToken } from '../interface/auth.interface';
import { JWTRefresh } from 'src/common/configs/strategy.config';
import { hashHexSha256 } from 'src/common/utils/hard-hex.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, JWTRefresh) {
  private TOKEN: string;
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (request: Request) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        this.TOKEN = token;
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.publickey'), // Sử dụng public key
      algorithms: ['RS256'], // Xác định thuật toán bất đối xứng
    });
  }

  async validate({ email, id }: TGenerateAccessRefreshToken) {
    const newToken = hashHexSha256(this.TOKEN);
    const user = await this.userService.findOneUserByIdAndEmail(
      id,
      email,
      newToken,
    );
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }
}
