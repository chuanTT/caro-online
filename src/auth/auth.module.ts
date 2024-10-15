import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          privateKey: configService.get('jwt.privatekey'),
          publicKey: configService.get('jwt.publickey'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
            algorithm: 'RS256',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
