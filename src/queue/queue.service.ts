import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Queue } from './entities/queue.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { StatusQueue } from './enums';
import { OmitFindManyOption } from 'src/common/types/omit-find-many-options.type';
@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private readonly userService: UserService,
  ) {}

  async create(user: User) {
    await this.updateStatusWatingToCancel(user?.id);
    const queue = new Queue();
    queue.user = user;
    return await this.queueRepository.save(queue);
  }

  async findWatingByUser(userId: string, options?: OmitFindManyOption<Queue>) {
    return await this.queueRepository.find({
      where: {
        user: {
          id: userId,
        },
        status: StatusQueue.WAITING,
      },
      select: ['id'],
      ...(options ?? {}),
    });
  }

  async updateStatusWatingToCancel(userId: string) {
    const existingQueues = await this.findWatingByUser(userId);
    if (existingQueues?.length > 0) {
      await this.queueRepository.update(
        { user: { id: userId }, status: StatusQueue.WAITING },
        { status: StatusQueue.CANCEL },
      );
    }
  }

  findAll() {
    return `This action returns all queue`;
  }

  findOneById(id: string, options: FindManyOptions<Queue>) {
    return this.queueRepository.findOne({
      ...options,
      where: {
        ...(options?.where ?? {}),
        id,
      },
    });
  }

  async update(id: string) {
    const currentQueue = await this.findOneById(id, {
      where: {
        status: StatusQueue.WAITING,
      },
    });

    if (!currentQueue) {
      throw new UnprocessableEntityException(
        'Hàng chờ không tồn tại hoặc không ở trạng thái chờ',
      );
    }

    await this.queueRepository.update(currentQueue?.id, {
      status: StatusQueue.CANCEL,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
