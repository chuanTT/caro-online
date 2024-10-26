import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { CaroSocketService } from './caro-socket.service';
import { CreateCaroSocketDto } from './dto/create-caro-socket.dto';
import { UpdateCaroSocketDto } from './dto/update-caro-socket.dto';

@WebSocketGateway()
export class CaroSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly caroSocketService: CaroSocketService) {}

  handleDisconnect(client: any) {
    console.log(client);
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  @SubscribeMessage('createCaroSocket')
  create(@MessageBody() createCaroSocketDto: CreateCaroSocketDto) {
    return this.caroSocketService.create(createCaroSocketDto);
  }

  @SubscribeMessage('findAllCaroSocket')
  findAll() {
    return this.caroSocketService.findAll();
  }

  @SubscribeMessage('findOneCaroSocket')
  findOne(@MessageBody() id: number) {
    return this.caroSocketService.findOne(id);
  }

  @SubscribeMessage('updateCaroSocket')
  update(@MessageBody() updateCaroSocketDto: UpdateCaroSocketDto) {
    return this.caroSocketService.update(
      updateCaroSocketDto.id,
      updateCaroSocketDto,
    );
  }

  @SubscribeMessage('removeCaroSocket')
  remove(@MessageBody() id: number) {
    return this.caroSocketService.remove(id);
  }
}
