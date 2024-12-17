import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { SYMBOL_REPOSITORY } from '@modules/symbol/symbol.di-tokens';
import { SymbolRepositoryPort } from '@modules/symbol/database/symbol.repository.port';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import {
  SymbolCodeAlreadyInUseError,
  SymbolNotFoundError,
} from '@modules/symbol/domain/symbol.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSymbolCommand } from './delete-symbol.command';

export type DeleteSymbolServiceResult = Result<
  boolean,
  SymbolNotFoundError | SymbolCodeAlreadyInUseError
>;

@CommandHandler(DeleteSymbolCommand)
export class DeleteSymbolService implements ICommandHandler {
  constructor(
    @Inject(SYMBOL_REPOSITORY)
    protected readonly symbolRepo: SymbolRepositoryPort,
  ) {}

  async execute(
    command: DeleteSymbolCommand,
  ): Promise<DeleteSymbolServiceResult> {
    const found = await this.symbolRepo.findOneByIdWithInUseCount(
      command.symbolId,
    );
    if (found.isNone()) {
      return Err(new SymbolNotFoundError());
    }

    const symbol = found.unwrap();
    const deleteResult = symbol.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }
    try {
      const result = await this.symbolRepo.delete({
        id: command.symbolId,
      } as SymbolEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new SymbolNotFoundError(error));
      }

      throw error;
    }
  }
}
