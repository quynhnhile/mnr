import { Injectable } from '@nestjs/common';
import { CacheService } from '@src/libs/cache/cache.service';

@Injectable()
export class JobRepairCleanService {
  constructor(private readonly cacheService: CacheService) {}

  async generateIdJob(prefix: string): Promise<string> {
    const now = new Date();

    const date = `${now.getFullYear().toString().slice(2)}${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

    const keyDate = `${prefix}${date}`;

    const index = await this.cacheService.incr(keyDate);

    if (index === 1) {
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      );

      const expireSeconds = Math.floor(
        (endOfDay.getTime() - now.getTime()) / 1000,
      );

      await this.cacheService.expire(keyDate, expireSeconds);
    }
    const formattedIndex = String(index).padStart(4, '0');

    return `${prefix}${date}${formattedIndex}`;
  }
}
