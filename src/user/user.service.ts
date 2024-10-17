import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashHexSha256 } from 'src/common/utils/hard-hex.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto = Object.assign(new User(), createUserDto);
    return await this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOneUserByIdAndEmail(id: string, email: string, refreshToken?: string) {
    return this.usersRepository.findOne({
      where: {
        id,
        email,
        refreshToken,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        activity: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true,
      },
    });
  }

  findOneEmail(email: string) {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async updateUserMe(id: string, updateUserDto: UpdateUserDto) {
    await this.update(id, updateUserDto);
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    return plainToInstance(User, user);
  }

  update(id: string, updateUser: Partial<User>) {
    return this.usersRepository.update(id, updateUser);
  }

  updateToken(id: string, token: string) {
    const hashToken = !!token ? hashHexSha256(token) : null;
    return this.usersRepository.update(id, { refreshToken: hashToken });
  }
}
