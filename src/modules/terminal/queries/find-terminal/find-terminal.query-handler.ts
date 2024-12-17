import { Err, Ok, Result } from 'oxide.ts';
import { TERMINAL_REPOSITORY } from '@modules/terminal/terminal.di-tokens';
import { TerminalRepositoryPort } from '@modules/terminal/database/terminal.repository.port';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import { TerminalNotFoundError } from '@modules/terminal/domain/terminal.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindTerminalQuery {
  terminalId: bigint;

  constructor(public readonly id: bigint) {
    this.terminalId = id;
  }
}

export type FindTerminalQueryResult = Result<
  TerminalEntity,
  TerminalNotFoundError
>;

@QueryHandler(FindTerminalQuery)
export class FindTerminalQueryHandler implements IQueryHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(query: FindTerminalQuery): Promise<FindTerminalQueryResult> {
    const found = await this.terminalRepo.findOneById(query.terminalId);
    if (found.isNone()) return Err(new TerminalNotFoundError());

    return Ok(found.unwrap());
  }
}
