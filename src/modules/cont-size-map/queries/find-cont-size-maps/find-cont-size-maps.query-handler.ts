import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { CONT_SIZE_MAP_REPOSITORY } from '@modules/cont-size-map/cont-size-map.di-tokens';
import { ContSizeMapRepositoryPort } from '@modules/cont-size-map/database/cont-size-map.repository.port';
import { ContSizeMapEntity } from '@modules/cont-size-map/domain/cont-size-map.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindContSizeMapsQuery extends PrismaPaginatedQueryBase<Prisma.ContSizeMapWhereInput> {}

export type FindContSizeMapsQueryResult = Result<
  Paginated<ContSizeMapEntity>,
  void
>;

@QueryHandler(FindContSizeMapsQuery)
export class FindContSizeMapsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CONT_SIZE_MAP_REPOSITORY)
    protected readonly contSizeMapRepo: ContSizeMapRepositoryPort,
  ) {}

  async execute(
    query: FindContSizeMapsQuery,
  ): Promise<FindContSizeMapsQueryResult> {
    const result = await this.contSizeMapRepo.findAllPaginated(query);

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
