import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { OperationRepositoryPort } from '@modules/operation/database/operation.repository.port';
import { OperationEntity } from '@modules/operation/domain/operation.entity';
import { OPERATION_REPOSITORY } from '@modules/operation/operation.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindOperationsQuery extends PrismaPaginatedQueryBase<Prisma.OperationWhereInput> {}

export type FindOperationsQueryResult = Result<
  Paginated<OperationEntity>,
  void
>;

@QueryHandler(FindOperationsQuery)
export class FindOperationsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    protected readonly operationRepo: OperationRepositoryPort,
  ) {}

  async execute(
    query: FindOperationsQuery,
  ): Promise<FindOperationsQueryResult> {
    const result = await this.operationRepo.findAllPaginated(query);

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
