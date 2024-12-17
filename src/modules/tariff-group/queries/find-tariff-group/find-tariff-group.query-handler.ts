import { Err, Ok, Result } from 'oxide.ts';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TariffGroupNotFoundError } from '@modules/tariff-group/domain/tariff-group.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindTariffGroupQuery {
  tariffGroupId: bigint;

  constructor(public readonly id: bigint) {
    this.tariffGroupId = id;
  }
}

export type FindTariffGroupQueryResult = Result<
  TariffGroupEntity,
  TariffGroupNotFoundError
>;

@QueryHandler(FindTariffGroupQuery)
export class FindTariffGroupQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TARIFF_GROUP_REPOSITORY)
    protected readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async execute(
    query: FindTariffGroupQuery,
  ): Promise<FindTariffGroupQueryResult> {
    const found = await this.tariffGroupRepo.findOneById(query.tariffGroupId);
    if (found.isNone()) return Err(new TariffGroupNotFoundError());

    return Ok(found.unwrap());
  }
}
