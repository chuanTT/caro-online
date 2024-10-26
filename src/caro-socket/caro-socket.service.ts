import { Injectable } from '@nestjs/common';
import { CreateCaroSocketDto } from './dto/create-caro-socket.dto';
import { UpdateCaroSocketDto } from './dto/update-caro-socket.dto';

@Injectable()
export class CaroSocketService {
  create(createCaroSocketDto: CreateCaroSocketDto) {
    return 'This action adds a new caroSocket';
  }

  findAll() {
    return `This action returns all caroSocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caroSocket`;
  }

  update(id: number, updateCaroSocketDto: UpdateCaroSocketDto) {
    return `This action updates a #${id} caroSocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} caroSocket`;
  }
}
