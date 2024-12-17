import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from '@libs/exceptions';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRepairContCommand } from './delete-repair-cont.command';

export type DeleteRepairContServiceResult = Result<
  boolean,
  RepairContNotFoundError
>;

@CommandHandler(DeleteRepairContCommand)
export class DeleteRepairContService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    command: DeleteRepairContCommand,
  ): Promise<DeleteRepairContServiceResult> {
    try {
      const result = await this.repairContRepo.delete({
        id: command.repairContId,
      } as RepairContEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new RepairContNotFoundError(error));
      }

      throw error;
    }
  }
}
