import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { MNR_OVER_REPOSITORY } from '@modules/mnr-over/mnr-over.di-tokens';
import { MnrOverRepositoryPort } from '@modules/mnr-over/database/mnr-over.repository.port';
import { MnrOverEntity } from '@modules/mnr-over/domain/mnr-over.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindMnrOversQuery extends PrismaPaginatedQueryBase<Prisma.ConfigMnROverWhereInput> {}

export type FindMnrOversQueryResult = Result<Paginated<MnrOverEntity>, void>;

@QueryHandler(FindMnrOversQuery)
export class FindMnrOversQueryHandler implements IQueryHandler {
  constructor(
    @Inject(MNR_OVER_REPOSITORY)
    protected readonly mnrOverRepo: MnrOverRepositoryPort,
  ) {}

  async execute(query: FindMnrOversQuery): Promise<FindMnrOversQueryResult> {
    const result = await this.mnrOverRepo.findAllPaginated(query);

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
