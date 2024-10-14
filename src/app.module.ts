import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('HOST'),
          port: +configService.get('PORT_DB'),
          username: configService.get('USER_DB'),
          password: configService.get('PASSWORD_DB'),
          database: configService.get('DATABASE'),
          entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
          subscribers: [join(__dirname, '**', '*.subscriber{.ts,.js}')],
          synchronize: configService.get('SYNCHRONIZE'),
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
