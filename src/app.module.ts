import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { publicFolder } from './common/configs/file-default.config';
import { QueueModule } from './queue/queue.module';
import { ChessModule } from './chess/chess.module';
import { MoveModule } from './move/move.module';
import { CaroSocketModule } from './caro-socket/caro-socket.module';

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
          host: configService.get('database.host'),
          port: +configService.get('database.post'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
          synchronize: configService.get<boolean>('typeorm.synchronize', false),
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', publicFolder),
    }),
    UserModule,
    AuthModule,
    QueueModule,
    ChessModule,
    MoveModule,
    CaroSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
