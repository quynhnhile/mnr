import { EstimateDetailRepositoryPort } from '@modules/estimate/database/estimate-detail.repository.port';
import { EstimateDetailCreatedUpdatedDomainEvent } from '@modules/estimate/domain/events/estimate-detail-created.domain-event';
import { ESTIMATE_DETAIL_REPOSITORY } from '@modules/estimate/estimate.di-tokens';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { TariffRepositoryPort } from '@modules/tariff/database/tariff.repository.port';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';

@Injectable()
export class EstimateDetailCreatedUpdatedDomainEventHandler {
  constructor(
    @Inject(TARIFF_GROUP_REPOSITORY)
    private readonly tariffGroupRepo: TariffGroupRepositoryPort,
    @Inject(TARIFF_REPOSITORY)
    private readonly tariffRepo: TariffRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    private readonly estimateDetailRepo: EstimateDetailRepositoryPort,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(EstimateDetailCreatedUpdatedDomainEvent.name, {
    async: true,
    promisify: true,
  })
  async handle(event: EstimateDetailCreatedUpdatedDomainEvent): Promise<any> {
    const estimateDetailId = event.aggregateId;
    const operationCode = event.aggregateOpr;
    const foundEstimateDetail = await this.estimateDetailRepo.findOneById(
      estimateDetailId,
    );
    if (foundEstimateDetail.isNone()) return;

    const estimateDetail = foundEstimateDetail.unwrap();

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
    if (!foundTariffs.length) return;

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

    // save estimate detail
    await this.estimateDetailRepo.update(estimateDetail);
  }
}
