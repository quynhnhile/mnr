import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from '@src/libs/cache/cache.service';
import { ESTIMATE_DETAIL_REPOSITORY } from '../estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '../database/estimate-detail.repository.port';
import { TARIFF_REPOSITORY } from '@src/modules/tariff/tariff.di-tokens';
import { TariffRepositoryPort } from '@src/modules/tariff/database/tariff.repository.port';
import { Prisma } from '@prisma/client';
import { TARIFF_GROUP_REPOSITORY } from '@src/modules/tariff-group/tariff-group.di-tokens';
import { TariffGroupRepositoryPort } from '@src/modules/tariff-group/database/tariff-group.repository.port';
import { EstimateDetailEntity } from '../domain/estimate-detail.entity';

@Injectable()
export class EstimateService {
  constructor(
    private readonly cacheService: CacheService,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    private readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(TARIFF_REPOSITORY)
    private readonly tariffRepo: TariffRepositoryPort,
    @Inject(TARIFF_GROUP_REPOSITORY)
    private readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async generateEstimateNo(prefix: string): Promise<string> {
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

  async calculateTariff(
    estimateDetail: EstimateDetailEntity,
    operationCode: string,
  ): Promise<any> {
    const { compCode, repCode, locCode, quantity, length, width } =
      estimateDetail;

    let foundTariffGroupsSuitable =
      await this.tariffGroupRepo.findAll<Prisma.TariffGroupWhereInput>({
        where: {
          OR: [{ operationCode: { contains: operationCode } }],
        },
      });

    if (!foundTariffGroupsSuitable.length) {
      foundTariffGroupsSuitable =
        await this.tariffGroupRepo.findAll<Prisma.TariffGroupWhereInput>({
          where: {
            OR: [{ operationCode: { contains: '*' } }],
          },
        });
    }

    const groupTrfCodes = foundTariffGroupsSuitable.map(
      (tariffGroup) => tariffGroup.groupTrfCode,
    );

    // find suitable tariffs
    const foundTariffs = await this.tariffRepo.findAll<Prisma.TariffWhereInput>(
      {
        where: {
          compCode,
          repCode,
          groupTrfCode: { in: groupTrfCodes },
          AND: [
            {
              OR: [{ locCode: { contains: locCode || '' } }, { locCode: null }],
            },
            {
              OR: [
                { unit: 'Q', quantity: { lte: quantity } },
                { unit: 'L', length: { lte: length } },
                { unit: 'S', square: { lte: length * width } },
              ],
            },
          ],
        },
      },
    );

    // return if found none tariff
    if (!foundTariffs.length) {
      return;
    }

    // check if all tariffs are same unit
    const isSameUnit = foundTariffs.every(
      (tariff) => tariff.unit === foundTariffs[0].unit,
    );
    // if not same unit, sort tariffs by material amount, ascending
    if (isSameUnit) {
      // if same unit, sort tariffs depending on unit
      if (foundTariffs[0].unit === 'Q') {
        foundTariffs.sort((a, b) => a.quantity - b.quantity);
      }
      if (foundTariffs[0].unit === 'L') {
        foundTariffs.sort((a, b) => a.length - b.length);
      }
      if (foundTariffs[0].unit === 'S') {
        foundTariffs.sort((a, b) => a.square - b.square);
      }
    } else {
      foundTariffs.sort((a, b) => a.mateAmount - b.mateAmount);
    }

    // select the first tariff
    const tariff = foundTariffs[0];

    const foundTariffGroup = await this.tariffGroupRepo.findOneByCode(
      tariff.groupTrfCode,
    );
    if (foundTariffGroup.isNone()) return;
    const tariffGroup = foundTariffGroup.unwrap();

    const { unit } = tariff;

    if (unit === 'Q') {
      estimateDetail.calculateTariffByQuantity(tariffGroup, tariff);
    }

    if (unit === 'L') {
      estimateDetail.calculateTariffByLength(tariffGroup, tariff);
    }

    if (unit === 'S') {
      estimateDetail.calculateTariffBySquare(tariffGroup, tariff);
    }

    //return this.estimateDetailRepo.update(estimateDetail);
  }
}
