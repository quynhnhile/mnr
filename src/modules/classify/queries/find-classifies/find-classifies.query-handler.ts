import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { CLASSIFY_REPOSITORY } from '@modules/classify/classify.di-tokens';
import { ClassifyRepositoryPort } from '@modules/classify/database/classify.repository.port';
import { ClassifyEntity } from '@modules/classify/domain/classify.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindClassifiesQuery extends PrismaPaginatedQueryBase<Prisma.ClassifyWhereInput> {}

export type FindClassifiesQueryResult = Result<Paginated<ClassifyEntity>, void>;

@QueryHandler(FindClassifiesQuery)
export class FindClassifiesQueryHandler implements IQueryHandler {
  constructor(
    @Inject(CLASSIFY_REPOSITORY)
    protected readonly classifyRepo: ClassifyRepositoryPort,
  ) {}

  async execute(
    query: FindClassifiesQuery,
  ): Promise<FindClassifiesQueryResult> {
    const result = await this.classifyRepo.findAllPaginated(query);

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
