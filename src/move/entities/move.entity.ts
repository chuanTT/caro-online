import { Chess } from 'src/chess/entities/chess.entity';
import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['chess', 'moveNumber'])
@Index(['positionX', 'positionY'])
export class Move extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  moveNumber: number;

  @Index('player_y_move')
  @ManyToOne(() => User, { nullable: true })
  player: User;

  @Column({
    name: 'position_x',
    type: 'integer',
  })
  positionX: number;

  @Column({
    name: 'position_y',
    type: 'integer',
  })
  positionY: number;

  @ManyToOne(() => Chess, (chess) => chess.moves)
  chess: Chess;
}
