import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEnum, StatusEnum } from '../interface/user.interface';
import { BaseTimeEntity } from 'src/common/entities/base-time.entity';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { length: 40 })
  firstName: string;

  @Column('varchar', { length: 40 })
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Column('varchar')
  password: string;

  @Column('enum', { enum: ActivityEnum, default: ActivityEnum.ONLINE })
  activity: number;

  @Column('enum', { enum: StatusEnum, default: StatusEnum.IDLE })
  status: number;
}
