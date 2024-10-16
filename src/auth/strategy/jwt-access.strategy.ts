import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TGenerateAccessRefreshToken } from '../interface/auth.interface';
import { JWTAccess } from 'src/common/configs/strategy.config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, JWTAccess) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.publickey'), // Sử dụng public key
      algorithms: ['RS256'], // Xác định thuật toán bất đối xứng
    });
  }

  async validate({ email, id }: TGenerateAccessRefreshToken) {
    const user = await this.userService.findOneUserByIdAndEmail(id, email);
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }
}
