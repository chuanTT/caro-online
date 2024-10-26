import { Module } from '@nestjs/common';
import { CaroSocketService } from './caro-socket.service';
import { CaroSocketGateway } from './caro-socket.gateway';

@Module({
  providers: [CaroSocketGateway, CaroSocketService],
  exports: [CaroSocketGateway],
})
export class CaroSocketModule {}
