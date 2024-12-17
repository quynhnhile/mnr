import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { InfoContRepositoryPort } from '@modules/info-cont/database/info-cont.repository.port';
import { InfoContEntity } from '@modules/info-cont/domain/info-cont.entity';
import { INFO_CONT_REPOSITORY } from '@modules/info-cont/info-cont.di-tokens';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindInfoContsQuery extends PrismaPaginatedQueryBase<Prisma.InfoContWhereInput> {}

export type FindInfoContsQueryResult = Result<Paginated<InfoContEntity>, void>;

@QueryHandler(FindInfoContsQuery)
export class FindInfoContsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(INFO_CONT_REPOSITORY)
    protected readonly infoContRepo: InfoContRepositoryPort,
  ) {}

  async execute(query: FindInfoContsQuery): Promise<FindInfoContsQueryResult> {
    const result = await this.infoContRepo.findAllPaginated(query);

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
