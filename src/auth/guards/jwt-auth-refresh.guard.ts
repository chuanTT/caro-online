import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWTRefresh } from 'src/common/configs/strategy.config';

@Injectable()
export class JWTAuthRefreshGuard extends AuthGuard(JWTRefresh) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      return true; // Trả về true nếu xác thực thành công
    } catch {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
  }
}
