import { Err, Ok, Result } from 'oxide.ts';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import { PayerNotFoundError } from '@modules/payer/domain/payer.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindPayerQuery {
  payerId: bigint;

  constructor(public readonly id: bigint) {
    this.payerId = id;
  }
}

export type FindPayerQueryResult = Result<PayerEntity, PayerNotFoundError>;

@QueryHandler(FindPayerQuery)
export class FindPayerQueryHandler implements IQueryHandler {
  constructor(
    @Inject(PAYER_REPOSITORY)
    protected readonly payerRepo: PayerRepositoryPort,
  ) {}

  async execute(query: FindPayerQuery): Promise<FindPayerQueryResult> {
    const found = await this.payerRepo.findOneById(query.payerId);
    if (found.isNone()) return Err(new PayerNotFoundError());

    return Ok(found.unwrap());
  }
}
