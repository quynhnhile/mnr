import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { COM_DAM_REP_REPOSITORY } from '@modules/com-dam-rep/com-dam-rep.di-tokens';
import { ComDamRepRepositoryPort } from '@modules/com-dam-rep/database/com-dam-rep.repository.port';
import { ComDamRepEntity } from '@modules/com-dam-rep/domain/com-dam-rep.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindComDamRepsQuery extends PrismaPaginatedQueryBase<Prisma.ComDamRepWhereInput> {}

export type FindComDamRepsQueryResult = Result<
  Paginated<ComDamRepEntity>,
  void
>;

@QueryHandler(FindComDamRepsQuery)
export class FindComDamRepsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(COM_DAM_REP_REPOSITORY)
    protected readonly comDamRepRepo: ComDamRepRepositoryPort,
  ) {}

  async execute(
    query: FindComDamRepsQuery,
  ): Promise<FindComDamRepsQueryResult> {
    const result = await this.comDamRepRepo.findAllPaginated(query);

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
