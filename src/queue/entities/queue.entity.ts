import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';

@Entity()
export class Queue extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('user_queue') // Tên chỉ mục
  @ManyToOne(() => User, (user) => user.queues)
  user: User;
}
