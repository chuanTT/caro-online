import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Queue } from './entities/queue.entity';
import { FindManyOptions, Not, Repository } from 'typeorm';
import { StatusQueue } from './enums';
import { OmitFindManyOption } from 'src/common/types/omit-find-many-options.type';
import { mathTeam } from './constant/math-team.const';
import { ChessService } from 'src/chess/chess.service';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private readonly chessService: ChessService,
  ) {}

  async checkAndMatchTeam(userId: string, team = mathTeam): Promise<boolean> {
    const playersInQueue = await this.queueRepository.count({
      where: {
        status: StatusQueue.WAITING,
        user: {
          id: Not(userId),
        },
      },
    });
    return playersInQueue >= team; // Chỉ cần có 1 người là đủ ghép đội
  }

  async mathedTeamTransaction(user: User, currentQueue: Queue) {
    let isMathed = false;
    let currentPlayer: Queue = undefined;
    await this.queueRepository.manager.transaction(async (entityManager) => {
      const players = await this.findAllByStatusWating({
        options: {
          relations: {
            user: true,
          },
        },
        userId: user?.id,
      });
      if (players?.length > 0) {
        currentPlayer = players[0];
        await entityManager.update(Queue, currentPlayer?.id, {
          status: StatusQueue.MATCHED,
        });
        await entityManager.update(Queue, currentQueue?.id, {
          status: StatusQueue.MATCHED,
        });
        isMathed = true;
      }
    });

    if (isMathed && currentPlayer?.user) {
      await this.chessService.create(currentQueue?.user, currentPlayer?.user);
    }
    return isMathed;
  }

  async create(user: User) {
    const checkQueue = await this.queueRepository.findOne({
      where: {
        user: {
          id: user?.id,
        },
        status: StatusQueue.MATCHED,
      },
      select: ['id'],
    });

    if (checkQueue) {
      throw new UnprocessableEntityException('Bạn đã được ghép cặp đấu rồi!!');
    }

    await this.updateStatusWatingToCancel(user?.id);
    const queue = new Queue();
    queue.user = user;
    const resultQueue = await this.queueRepository.save(queue);
    const firstPlayer = await this.checkAndMatchTeam(user?.id);
    if (firstPlayer) {
      const isMathed = await this.mathedTeamTransaction(user, resultQueue);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isMathed && resultQueue && (resultQueue.status = StatusQueue.MATCHED);
    }
    return resultQueue;
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

  async findAllByStatusWating({
    userId,
    limit,
    options,
  }: {
    limit?: number;
    userId: string;
    options?: OmitFindManyOption<Queue>;
  }) {
    return this.queueRepository.find({
      where: {
        status: StatusQueue.WAITING,
        user: {
          id: Not(userId),
        },
      },
      order: {
        createdAt: 'ASC',
      },
      skip: 0,
      take: limit,
      ...options,
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

  async updateStatusToMatched(id: string) {
    return this.queueRepository.update(id, {
      status: StatusQueue.MATCHED,
    });
  }

  async updateStatusToCompleted(id: string) {
    return await this.queueRepository.update(id, {
      status: StatusQueue.COMPLETED,
    });
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

  async cancelQueue(id: string) {
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
}
