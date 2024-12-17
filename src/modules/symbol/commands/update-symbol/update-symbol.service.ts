import { Err, Ok, Result } from 'oxide.ts';
import { SYMBOL_REPOSITORY } from '@modules/symbol/symbol.di-tokens';
import { SymbolRepositoryPort } from '@modules/symbol/database/symbol.repository.port';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import {
  SymbolCodeAlreadyExistsError,
  SymbolCodeAlreadyInUseError,
  SymbolNotFoundError,
} from '@modules/symbol/domain/symbol.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSymbolCommand } from './update-symbol.command';
import { ConflictException } from '@libs/exceptions';

export type UpdateSymbolServiceResult = Result<
  SymbolEntity,
  | SymbolNotFoundError
  | SymbolCodeAlreadyExistsError
  | SymbolCodeAlreadyInUseError
>;

@CommandHandler(UpdateSymbolCommand)
export class UpdateSymbolService implements ICommandHandler {
  constructor(
    @Inject(SYMBOL_REPOSITORY)
    protected readonly symbolRepo: SymbolRepositoryPort,
  ) {}

  async execute(
    command: UpdateSymbolCommand,
  ): Promise<UpdateSymbolServiceResult> {
    const found = await this.symbolRepo.findOneByIdWithInUseCount(
      command.symbolId,
    );
    if (found.isNone()) {
      return Err(new SymbolNotFoundError());
    }

    const symbol = found.unwrap();
    const updateResult = symbol.update({
      ...command.getExtendedProps<UpdateSymbolCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }
    try {
      const updatedSymbol = await this.symbolRepo.update(symbol);
      return Ok(updatedSymbol);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new SymbolCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
