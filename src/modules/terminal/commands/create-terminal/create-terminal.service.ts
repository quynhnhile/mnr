import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { TERMINAL_REPOSITORY } from '@modules/terminal/terminal.di-tokens';
import { TerminalRepositoryPort } from '@modules/terminal/database/terminal.repository.port';
import { TerminalCodeAlreadyExistsError } from '@modules/terminal/domain/terminal.error';
import { TerminalEntity } from '@modules/terminal/domain/terminal.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTerminalCommand } from './create-terminal.command';

export type CreateTerminalServiceResult = Result<
  TerminalEntity,
  TerminalCodeAlreadyExistsError
>;

@CommandHandler(CreateTerminalCommand)
export class CreateTerminalService implements ICommandHandler {
  constructor(
    @Inject(TERMINAL_REPOSITORY)
    protected readonly terminalRepo: TerminalRepositoryPort,
  ) {}

  async execute(
    command: CreateTerminalCommand,
  ): Promise<CreateTerminalServiceResult> {
    const terminal = TerminalEntity.create({
      ...command.getExtendedProps<CreateTerminalCommand>(),
    });

    try {
      const createdTerminal = await this.terminalRepo.insert(terminal);
      return Ok(createdTerminal);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TerminalCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
