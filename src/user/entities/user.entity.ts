import {
  AfterLoad,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityEnum, StatusEnum } from '../interface/user.interface';
import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { Exclude } from 'class-transformer';
import { Queue } from 'src/queue/entities/queue.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 40 })
  firstName: string;

  @Column('varchar', { length: 40 })
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('enum', { enum: ActivityEnum, default: ActivityEnum.ONLINE })
  activity: number;

  @Column('enum', { enum: StatusEnum, default: StatusEnum.IDLE })
  status: number;

  @Exclude()
  @Column('varchar', { length: 64, nullable: true })
  refreshToken: string;

  @OneToMany(() => Queue, (queue) => queue.user)
  queues: Queue[];

  fullName: string;

  get fullNameGetter(): string {
    return `${this.firstName?.trim() ?? ''} ${this.lastName?.trim() ?? ''}`.trim();
  }

  @AfterLoad()
  getFullName() {
    if (this.firstName || this.lastName) {
      this.fullName = this.fullNameGetter;
    }
  }
}
