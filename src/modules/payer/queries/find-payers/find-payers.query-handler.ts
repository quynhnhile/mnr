import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { PayerRepositoryPort } from '@modules/payer/database/payer.repository.port';
import { PayerEntity } from '@modules/payer/domain/payer.entity';
import { PAYER_REPOSITORY } from '@modules/payer/payer.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindPayersQuery extends PrismaPaginatedQueryBase<Prisma.PayerWhereInput> {}

export type FindPayersQueryResult = Result<Paginated<PayerEntity>, void>;

@QueryHandler(FindPayersQuery)
export class FindPayersQueryHandler implements IQueryHandler {
  constructor(
    @Inject(PAYER_REPOSITORY)
    protected readonly payerRepo: PayerRepositoryPort,
  ) {}

  async execute(query: FindPayersQuery): Promise<FindPayersQueryResult> {
    const result = await this.payerRepo.findAllPaginated(query);

    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
