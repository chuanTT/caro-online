import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Chess } from './entities/chess.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { StatusChess } from './enums/status-chess.enum';
import { OmitFindManyOption } from 'src/common/types/omit-find-many-options.type';
import { plainToInstance } from 'class-transformer';
import { TurnChess } from './enums/turn-chess.enum';
import { BasePagination } from 'src/common/abstract/Pagination.abstract';
import { FindWinnerDto } from './dto/find-winner.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChessService extends BasePagination<Chess> {
  constructor(
    @InjectRepository(Chess)
    private chessRepository: Repository<Chess>,
    private configSearch: ConfigService,
  ) {
    super(chessRepository, configSearch);
  }

  create(player1: User, player2: User) {
    const chess = new Chess();
    chess.player1 = player1;
    chess.player2 = player2;
    return this.chessRepository.save(chess);
  }

  async canPlayerMakeMove(id: string, userId: string) {
    const currentPlay = await this.findOneOnGoing(id, userId, {
      relations: {
        player1: true,
        player2: true,
      },
    });

    const turnX =
      currentPlay?.currentTurn === TurnChess.X &&
      userId === currentPlay?.player1?.id;
    const turnO =
      currentPlay?.currentTurn === TurnChess.O &&
      userId === currentPlay?.player2?.id;
    return turnX || turnO;
  }

  async updateTurn(id: string, userId: string) {
    const currentData = await this.findOne(
      id,
      userId,
      {
        status: StatusChess.ONGOING,
      },
      {
        relations: {
          player1: true,
          player2: true,
        },
      },
    );

    let currentTurn: TurnChess | undefined;
    if (
      currentData?.player1?.id === userId &&
      currentData?.currentTurn === TurnChess.X
    ) {
      currentTurn = TurnChess.O;
    } else if (
      currentData?.player2?.id === userId &&
      currentData?.currentTurn === TurnChess.O
    ) {
      currentTurn = TurnChess.X;
    }

    if (currentTurn !== undefined) {
      const updated = await this.chessRepository.update(id, {
        currentTurn,
      });
      return !!updated?.affected;
    }
    return false;
  }

  async findOne(
    id: string,
    userId: string,
    where?: FindManyOptions<Chess>['where'],
    options?: OmitFindManyOption<Chess>,
  ) {
    const currentWhere = { id, ...where };
    const current = await this.chessRepository.findOne({
      where: [
        {
          ...currentWhere,
          player1: {
            id: userId,
          },
        },

        {
          ...currentWhere,
          player2: {
            id: userId,
          },
        },
      ],
      relations: {
        player1: true,
        player2: true,
        winner: true,
      },
      ...options,
    });

    if (!current) {
      throw new BadRequestException(
        'Không tìm thấy bàn hoặc bạn không có trong bàn này!!',
      );
    }

    return plainToInstance(Chess, current);
  }

  async findOneOnGoing(
    id: string,
    userId: string,
    options?: OmitFindManyOption<Chess>,
  ) {
    const currentWhere = { status: StatusChess.ONGOING, id };
    const current = await this.chessRepository.findOne({
      where: [
        {
          ...currentWhere,
          player1: {
            id: userId,
          },
        },

        {
          ...currentWhere,
          player2: {
            id: userId,
          },
        },
      ],
      ...options,
    });

    if (!current) {
      throw new BadRequestException('Bạn không phải là người chơi');
    }

    return plainToInstance(Chess, current);
  }

  async findAllWinder(
    userId: string,
    { endDate, limit, page, startDate }: FindWinnerDto,
  ) {
    return await this.paginate({
      options: {
        where: {
          status: StatusChess.COMPLETED,
          winner: {
            id: userId,
          },
          endDate: endDate
            ? Between(startDate, endDate)
            : Between(startDate, startDate),
        },
        relations: {
          player1: true,
          player2: true,
          winner: true,
        },
      },
      limit,
      page,
    });
  }

  async updateWinner(id: string, userId: string) {
    return this.chessRepository.update(
      {
        id,
        status: StatusChess.ONGOING,
      },
      {
        winner: {
          id: userId,
        },
      },
    );
  }
}
