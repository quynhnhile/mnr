import { Ok, Result } from 'oxide.ts';
import { Paginated } from '@libs/ddd';
import { TERMINAL_REPOSITORY } from '@modules/terminal/terminal.di-tokens';
import { TerminalRepositoryPort } from '@modules/terminal/database/terminal.repository.port';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from '@libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export class FindTerminalsQuery extends PrismaPaginatedQueryBase<Prisma.TerminalWhereInput> {}

export type FindTerminalsQueryResult = Result<Paginated<TerminalEntity>, void>;

@QueryHandler(FindTerminalsQuery)
export class FindTerminalsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(query: FindTerminalsQuery): Promise<FindTerminalsQueryResult> {
    const result = await this.terminalRepo.findAllPaginated(query);

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
