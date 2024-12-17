import { Err, Ok, Result } from 'oxide.ts';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@modules/job-repair-clean/database/job-repair-clean.repository.port';
import { JobRepairCleanEntity } from '@modules/job-repair-clean/domain/job-repair-clean.entity';
import { JobRepairCleanNotFoundError } from '@modules/job-repair-clean/domain/job-repair-clean.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateJobRepairCleanCommand } from './update-job-repair-clean.command';
import { REPAIR_REPOSITORY } from '@src/modules/repair/repair.di-tokens';
import { VENDOR_REPOSITORY } from '@src/modules/vendor/vendor.di-tokens';
import { RepairRepositoryPort } from '@src/modules/repair/database/repair.repository.port';
import { VendorRepositoryPort } from '@src/modules/vendor/database/vendor.repository.port';
import { VendorNotFoundError } from '@src/modules/vendor/domain/vendor.error';
import { RepairNotFoundError } from '@src/modules/repair/domain/repair.error';

export type UpdateJobRepairCleanServiceResult = Result<
  JobRepairCleanEntity,
  JobRepairCleanNotFoundError | RepairNotFoundError | VendorNotFoundError
>;

@CommandHandler(UpdateJobRepairCleanCommand)
export class UpdateJobRepairCleanService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_REPOSITORY)
    private readonly repairRepo: RepairRepositoryPort,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepo: VendorRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
  ) {}

  async execute(
    command: UpdateJobRepairCleanCommand,
  ): Promise<UpdateJobRepairCleanServiceResult> {
    const found = await this.jobRepairCleanRepo.findOneById(
      command.jobRepairCleanId,
    );
    if (found.isNone()) {
      return Err(new JobRepairCleanNotFoundError());
    }

    const props = command.getExtendedProps<UpdateJobRepairCleanCommand>();

    const { repCode, vendorCode } = props;
    const [foundRepair, foundVendor] = await Promise.all([
      repCode ? this.repairRepo.findOneByCode(repCode) : Promise.resolve(null),
      vendorCode
        ? this.vendorRepo.findOneByCode(vendorCode)
        : Promise.resolve(null),
    ]);

    if (repCode && foundRepair?.isNone()) {
      return Err(new RepairNotFoundError());
    }

    if (vendorCode && foundVendor?.isNone()) {
      return Err(new VendorNotFoundError());
    }

    const jobRepairClean = found.unwrap();
    jobRepairClean.update({
      ...command.getExtendedProps<UpdateJobRepairCleanCommand>(),
    });

    try {
      const updatedJobRepairClean = await this.jobRepairCleanRepo.update(
        jobRepairClean,
      );
      return Ok(updatedJobRepairClean);
    } catch (error: any) {
      throw error;
    }
  }
}
