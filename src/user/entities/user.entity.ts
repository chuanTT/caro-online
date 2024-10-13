import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEnum, StatusEnum } from '../interface/user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('varchar', { length: 40 })
  firstName: string;

  @Column('varchar', { length: 40 })
  lastName: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  avatar: string;

  @Column('varchar')
  password: string;

  @Column('enum', { enum: ActivityEnum })
  activity: number;

  @Column('enum', { enum: StatusEnum })
  status: number;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;
}
