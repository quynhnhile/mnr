import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { TERMINAL_REPOSITORY } from '@modules/terminal/terminal.di-tokens';
import { TerminalRepositoryPort } from '@modules/terminal/database/terminal.repository.port';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import {
  TerminalNotFoundError,
  TerminalCodeAlreadyExistsError,
  TerminalCodeAlreadyInUseError,
} from '@modules/terminal/domain/terminal.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTerminalCommand } from './update-terminal.command';

export type UpdateTerminalServiceResult = Result<
  TerminalEntity,
  | TerminalNotFoundError
  | TerminalCodeAlreadyExistsError
  | TerminalCodeAlreadyInUseError
>;

@CommandHandler(UpdateTerminalCommand)
export class UpdateTerminalService implements ICommandHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(
    command: UpdateTerminalCommand,
  ): Promise<UpdateTerminalServiceResult> {
    const found = await this.terminalRepo.findOneById(command.terminalId);
    if (found.isNone()) {
      return Err(new TerminalNotFoundError());
    }

    const terminal = found.unwrap();
    const updateResult = terminal.update({
      ...command.getExtendedProps<UpdateTerminalCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedTerminal = await this.terminalRepo.update(terminal);
      return Ok(updatedTerminal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TerminalCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
