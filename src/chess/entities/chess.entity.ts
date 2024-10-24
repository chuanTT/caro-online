import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StatusChess } from '../enums/status-chess.enum';
import { TurnChess } from '../enums/turn-chess.enum';

export class Chess extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { default: 50 })
  row: number;

  @Column('integer', { default: 50 })
  column: number;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer2)
  player2: User;

  @ManyToOne(() => User, { nullable: true })
  winner: User | null;

  @Column({
    name: 'current_turn',
    type: 'smallint',
    default: TurnChess.X,
  })
  currentTurn: TurnChess;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: true,
  })
  endDate: Date | null;

  @Column({
    name: 'status',
    type: 'smallint',
    default: StatusChess.ONGOING,
  })
  status: string;
}
