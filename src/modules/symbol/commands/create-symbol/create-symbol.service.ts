import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { SYMBOL_REPOSITORY } from '@modules/symbol/symbol.di-tokens';
import { SymbolRepositoryPort } from '@modules/symbol/database/symbol.repository.port';
import { SymbolEntity } from '@modules/symbol/domain/symbol.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSymbolCommand } from './create-symbol.command';
import { SymbolCodeAlreadyExistsError } from '../../domain/symbol.error';

export type CreateSymbolServiceResult = Result<
  SymbolEntity,
  SymbolCodeAlreadyExistsError
>;

@CommandHandler(CreateSymbolCommand)
export class CreateSymbolService implements ICommandHandler {
  constructor(
    @Inject(SYMBOL_REPOSITORY)
    protected readonly symbolRepo: SymbolRepositoryPort,
  ) {}

  async execute(
    command: CreateSymbolCommand,
  ): Promise<CreateSymbolServiceResult> {
    const symbol = SymbolEntity.create({
      ...command.getExtendedProps<CreateSymbolCommand>(),
    });

    try {
      const createdSymbol = await this.symbolRepo.insert(symbol);
      return Ok(createdSymbol);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new SymbolCodeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
