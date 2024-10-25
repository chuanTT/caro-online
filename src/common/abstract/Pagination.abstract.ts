import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationOptions } from '../types/pagination.type';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

@Injectable()
export abstract class BasePagination<T> {
  constructor(
    protected readonly repository: Repository<T>,
    private configService: ConfigService,
  ) {}

  async paginate({
    options,
    limit,
    page,
  }: PaginationOptions<T>): Promise<PaginatedResult<T>> {
    if (!limit) {
      limit = +this.configService.get('pagination.limit', 500);
    }

    if (!page || page <= 0) {
      page = 1;
    }

    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit, // Bỏ qua số mục
      take: limit, // Số mục cần lấy
      ...options,
    });

    return {
      items: plainToInstance<T, any>(this.repository.target as any, items),
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
}
