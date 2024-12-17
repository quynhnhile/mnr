import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { TARIFF_REPOSITORY } from '@modules/tariff/tariff.di-tokens';
import { TariffRepositoryPort } from '@modules/tariff/database/tariff.repository.port';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { TariffNotFoundError } from '@modules/tariff/domain/tariff.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTariffCommand } from './delete-tariff.command';

export type DeleteTariffServiceResult = Result<boolean, TariffNotFoundError>;

@CommandHandler(DeleteTariffCommand)
export class DeleteTariffService implements ICommandHandler {
  constructor(
    @Inject(TARIFF_REPOSITORY)
    protected readonly tariffRepo: TariffRepositoryPort,
  ) {}

  async execute(
    command: DeleteTariffCommand,
  ): Promise<DeleteTariffServiceResult> {
    try {
      const result = await this.tariffRepo.delete({
        id: command.tariffId,
      } as TariffEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new TariffNotFoundError(error));
      }

      throw error;
    }
  }
}
