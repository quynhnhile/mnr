import { Ok, Result } from 'oxide.ts';
import { PrismaQueryBase } from '@libs/ddd/prisma-query.base';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { TerminalRepositoryPort } from '../../database/terminal.repository.port';
import { TerminalEntity } from '../../domain/terminal.entity';
import { TERMINAL_REPOSITORY } from '../../terminal.di-tokens';

export class FindAllTerminalsQuery extends PrismaQueryBase<Prisma.TerminalWhereInput> {}

export type FindAllTerminalsQueryResult = Result<TerminalEntity[], void>;

@QueryHandler(FindAllTerminalsQuery)
export class FindAllTerminalsQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(
    query: FindAllTerminalsQuery,
  ): Promise<FindAllTerminalsQueryResult> {
    const where = query.where || {};
    const terminal = await this.terminalRepo.findAll({ where });
    return Ok(terminal);
  }
}
