import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Column,
} from 'typeorm';
import { StatusQueue } from '../enums';

@Entity()
export class Queue extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('status_queue')
  @Column({
    name: 'status',
    type: 'smallint',
    default: StatusQueue.WAITING,
  })
  status: StatusQueue;

  @Index('user_queue') // Tên chỉ mục
  @ManyToOne(() => User, (user) => user.queues)
  user: User;
}
