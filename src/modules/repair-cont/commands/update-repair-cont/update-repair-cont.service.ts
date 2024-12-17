import { Err, Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRepairContCommand } from './update-repair-cont.command';

export type UpdateRepairContServiceResult = Result<
  RepairContEntity,
  RepairContNotFoundError
>;

@CommandHandler(UpdateRepairContCommand)
export class UpdateRepairContService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    command: UpdateRepairContCommand,
  ): Promise<UpdateRepairContServiceResult> {
    const found = await this.repairContRepo.findOneById(command.repairContId);
    if (found.isNone()) {
      return Err(new RepairContNotFoundError());
    }

    const repairCont = found.unwrap();
    repairCont.update({
      ...command.getExtendedProps<UpdateRepairContCommand>(),
    });

    try {
      const updatedRepairCont = await this.repairContRepo.update(repairCont);
      return Ok(updatedRepairCont);
    } catch (error: any) {
      throw error;
    }
  }
}
