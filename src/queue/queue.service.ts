import { Injectable } from '@nestjs/common';
@Injectable()
export class QueueService {
  create() {
    return 'This action adds a new queue';
  }

  findAll() {
    return `This action returns all queue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} queue`;
  }

  update(id: number) {
    return `This action updates a #${id} queue`;
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
