import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { TERMINAL_REPOSITORY } from '@modules/terminal/terminal.di-tokens';
import { TerminalRepositoryPort } from '@modules/terminal/database/terminal.repository.port';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import {
  TerminalNotFoundError,
  TerminalCodeAlreadyInUseError,
} from '@modules/terminal/domain/terminal.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTerminalCommand } from './delete-terminal.command';

export type DeleteTerminalServiceResult = Result<
  boolean,
  TerminalNotFoundError | TerminalCodeAlreadyInUseError
>;

@CommandHandler(DeleteTerminalCommand)
export class DeleteTerminalService implements ICommandHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(
    command: DeleteTerminalCommand,
  ): Promise<DeleteTerminalServiceResult> {
    const found = await this.terminalRepo.findOneByIdWithInUseCount(
      command.terminalId,
    );
    if (found.isNone()) {
      return Err(new TerminalNotFoundError());
    }

    const terminal = found.unwrap();
    const deleteResult = terminal.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.terminalRepo.delete({
        id: command.terminalId,
      } as TerminalEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new TerminalNotFoundError(error));
      }

      throw error;
    }
  }
}
