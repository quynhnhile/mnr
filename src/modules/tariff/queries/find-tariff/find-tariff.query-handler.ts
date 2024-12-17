import { Err, Ok, Result } from 'oxide.ts';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { TariffRepositoryPort } from '@modules/tariff/database/tariff.repository.port';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { TariffNotFoundError } from '@modules/tariff/domain/tariff.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindTariffQuery {
  tariffId: bigint;

  constructor(public readonly id: bigint) {
    this.tariffId = id;
  }
}

export type FindTariffQueryResult = Result<TariffEntity, TariffNotFoundError>;

@QueryHandler(FindTariffQuery)
export class FindTariffQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TARIFF_REPOSITORY)
    protected readonly tariffRepo: TariffRepositoryPort,
  ) {}

  async execute(query: FindTariffQuery): Promise<FindTariffQueryResult> {
    const found = await this.tariffRepo.findOneById(query.tariffId);
    if (found.isNone()) return Err(new TariffNotFoundError());

    return Ok(found.unwrap());
  }
}
