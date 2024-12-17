import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@libs/exceptions';
import { RepairRepositoryPort } from '@modules/repair/database/repair.repository.port';
import { RepairEntity } from '@modules/repair/domain/repair.entity';
import { RepairCodeAlreadyExistError } from '@modules/repair/domain/repair.error';
import { REPAIR_REPOSITORY } from '@modules/repair/repair.di-tokens';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRepairCommand } from './create-repair.command';

export type CreateRepairServiceResult = Result<
  RepairEntity,
  RepairCodeAlreadyExistError
>;

@CommandHandler(CreateRepairCommand)
export class CreateRepairService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    protected readonly repairRepo: RepairRepositoryPort,
  ) {}

  async execute(
    command: CreateRepairCommand,
  ): Promise<CreateRepairServiceResult> {
    const repair = RepairEntity.create({
      ...command.getExtendedProps<CreateRepairCommand>(),
    });

    try {
      const createdRepair = await this.repairRepo.insert(repair);
      return Ok(createdRepair);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new RepairCodeAlreadyExistError());
      }
      throw error;
    }
  }
}
