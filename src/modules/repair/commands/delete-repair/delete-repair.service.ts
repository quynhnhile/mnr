import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import {
  RepairCodeAlreadyInUseError,
  RepairNotFoundError,
} from '@modules/repair/domain/repair.error';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRepairCommand } from './delete-repair.command';

export type DeleteRepairServiceResult = Result<
  boolean,
  RepairNotFoundError | RepairCodeAlreadyInUseError
>;

@CommandHandler(DeleteRepairCommand)
export class DeleteRepairService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    protected readonly repairRepo: RepairRepositoryPort,
  ) {}

  async execute(
    command: DeleteRepairCommand,
  ): Promise<DeleteRepairServiceResult> {
    const found = await this.repairRepo.findOneByIdWithInUseCount(
      command.repairId,
    );
    if (found.isNone()) {
      return Err(new RepairNotFoundError());
    }

    const repair = found.unwrap();
    const deleteResult = repair.delete();
    if (deleteResult.isErr()) {
      return deleteResult;
    }

    try {
      const result = await this.repairRepo.delete(repair);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new RepairNotFoundError(error));
      }

      throw error;
    }
  }
}
