import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { TariffGroupRepositoryPort } from '@modules/tariff-group/database/tariff-group.repository.port';
import {
  TariffGroupCodeAlreadyInUseError,
  TariffGroupNotFoundError,
} from '@modules/tariff-group/domain/tariff-group.error';
import { TARIFF_GROUP_REPOSITORY } from '@modules/tariff-group/tariff-group.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTariffGroupCommand } from './delete-tariff-group.command';

export type DeleteTariffGroupServiceResult = Result<
  boolean,
  TariffGroupNotFoundError | TariffGroupCodeAlreadyInUseError
>;

@CommandHandler(DeleteTariffGroupCommand)
export class DeleteTariffGroupService implements ICommandHandler {
  constructor(
    @Inject(TARIFF_GROUP_REPOSITORY)
    protected readonly tariffGroupRepo: TariffGroupRepositoryPort,
  ) {}

  async execute(
    command: DeleteTariffGroupCommand,
  ): Promise<DeleteTariffGroupServiceResult> {
    const found = await this.tariffGroupRepo.findOneByIdWithInUseCount(
      command.tariffGroupId,
    );
    if (found.isNone()) {
      return Err(new TariffGroupNotFoundError());
    }

    const tariffGroup = found.unwrap();
    const deleteResult = tariffGroup.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.tariffGroupRepo.delete(tariffGroup);
      return Ok(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return Err(new TariffGroupNotFoundError(error));
      }

      throw error;
    }
  }
}
