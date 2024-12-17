import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import {
  RepairCodeAlreadyExistError,
  RepairCodeAlreadyInUseError,
  RepairNotFoundError,
} from '@modules/repair/domain/repair.error';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRepairCommand } from './update-repair.command';

export type UpdateRepairServiceResult = Result<
  RepairEntity,
  | RepairNotFoundError
  | RepairCodeAlreadyInUseError
  | RepairCodeAlreadyExistError
>;

@CommandHandler(UpdateRepairCommand)
export class UpdateRepairService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    protected readonly repairRepo: RepairRepositoryPort,
  ) {}

  async execute(
    command: UpdateRepairCommand,
  ): Promise<UpdateRepairServiceResult> {
    const found = await this.repairRepo.findOneByIdWithInUseCount(
      command.repairId,
    );
    if (found.isNone()) {
      return Err(new RepairNotFoundError());
    }

    const repair = found.unwrap();
    const updateResult = repair.update({
      ...command.getExtendedProps<UpdateRepairCommand>(),
    });
    if (updateResult.isErr()) {
      return updateResult;
    }

    try {
      const updatedRepair = await this.repairRepo.update(repair);
      return Ok(updatedRepair);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new RepairCodeAlreadyExistError());
      }

      throw error;
    }
  }
}
