import {
  AfterLoad,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { Exclude } from 'class-transformer';
import { Queue } from 'src/queue/entities/queue.entity';
import { ActivityEnum, StatusEnum } from '../enums';
import { Chess } from 'src/chess/entities/chess.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 40,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 40,
  })
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column({
    name: 'activity',
    type: 'smallint',
    default: ActivityEnum.ONLINE,
  })
  activity: ActivityEnum;

  @Column({
    name: 'status',
    type: 'smallint',
    default: StatusEnum.IDLE,
  })
  status: number;

  @Exclude()
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: true,
  })
  refreshToken: string;

  @OneToMany(() => Queue, (queue) => queue.user)
  queues: Queue[];

  @OneToMany(() => Chess, (chess) => chess.player1)
  gamesAsPlayer1: Chess[];

  @OneToMany(() => Chess, (chess) => chess.player2)
  gamesAsPlayer2: Chess[];

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
