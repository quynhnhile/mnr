import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteAllJobCommand } from './complete-all-job.command';
import { JOB_REPAIR_CLEAN_REPOSITORY } from '@src/modules/job-repair-clean/job-repair-clean.di-tokens';
import { JobRepairCleanRepositoryPort } from '@src/modules/job-repair-clean/database/job-repair-clean.repository.port';
import {
  EstimateIsNotAvailableToCompleteAllError,
  EstimateNotFoundError,
} from '../../domain/estimate.error';
import { EstimateRepositoryPort } from '../../database/estimate.repository.port';
import {
  ESTIMATE_DETAIL_REPOSITORY,
  ESTIMATE_REPOSITORY,
} from '../../estimate.di-tokens';
import { EstimateDetailRepositoryPort } from '../../database/estimate-detail.repository.port';
import { Prisma } from '@prisma/client';
import { RepairContRepositoryPort } from '@src/modules/repair-cont/database/repair-cont.repository.port';
import { REPAIR_CONT_REPOSITORY } from '@src/modules/repair-cont/repair-cont.di-tokens';
import { RepairContNotFoundError } from '@src/modules/repair-cont/domain/repair-cont.error';
import { JobRepairCleanEntity } from '@src/modules/job-repair-clean/domain/job-repair-clean.entity';

export type CompleteAllJobServiceResult = Result<
  JobRepairCleanEntity[],
  | EstimateNotFoundError
  | RepairContNotFoundError
  | EstimateIsNotAvailableToCompleteAllError
>;

@CommandHandler(CompleteAllJobCommand)
export class CompleteAllJobService implements ICommandHandler {
  constructor(
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
    @Inject(ESTIMATE_DETAIL_REPOSITORY)
    protected readonly estimateDetailRepo: EstimateDetailRepositoryPort,
    @Inject(JOB_REPAIR_CLEAN_REPOSITORY)
    protected readonly jobRepairCleanRepo: JobRepairCleanRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    command: CompleteAllJobCommand,
  ): Promise<CompleteAllJobServiceResult> {
    // find estimate by id
    const foundEstimate = await this.estimateRepo.findOneById(
      command.estimateId,
    );
    if (foundEstimate.isNone()) {
      return Err(new EstimateNotFoundError());
    }
    const estimate = foundEstimate.unwrap();

    // find all estimate details
    const foundEstimateDetails =
      await this.estimateDetailRepo.findAllEstimateDetails({
        where: {
          idEstimate: Number(estimate.id),
        },
        include: {
          jobRepairCleans: true,
        },
      });
    const allEstimateDetails = foundEstimateDetails.map((item) => {
      return Number(item.id);
    });

    // find all jobs
    let foundJobs =
      await this.jobRepairCleanRepo.findAll<Prisma.JobRepairCleanWhereInput>({
        where: {
          estimateDetail: {
            id: {
              in: allEstimateDetails,
            },
          },
        },
      });

    if (command.isClean) {
      foundJobs = foundJobs
        .filter((item) => item.isClean == true)
        .map((item) => {
          return item;
        });
    } else {
      foundJobs = foundJobs
        .filter((item) => item.isClean == false)
        .map((item) => {
          return item;
        });
    }

    // Không được complete all nếu estimate detail chưa insert đủ dòng xuống job (trừ các detail bị cancel thì không insert xuống job)
    const estimateDetailExcludeCancel = foundEstimateDetails.filter(
      (e) => !e.cancelBy,
    );
    if (
      estimateDetailExcludeCancel.some(
        (estimateDetail) => !estimateDetail.jobRepairCleans.length,
      )
    ) {
      return Err(new EstimateIsNotAvailableToCompleteAllError());
    }

    // Nếu estimate detail đã insert đủ dòng xuống job => complete all jobs
    foundJobs.forEach((jobRepairClean) => {
      jobRepairClean.complete({
        completeBy: command.completeBy,
      });
    });

    // find repair cont by id_ref in dt_estimate
    const foundRepairCont =
      await this.repairContRepo.findRepairContByIdRefInEstimate({
        id: estimate.idRef,
      });

    if (foundRepairCont.isNone()) {
      return Err(new RepairContNotFoundError());
    }
    const repairCont = foundRepairCont.unwrap();

    // complete repair cont
    repairCont.complete({
      completeBy: command.completeBy,
    });

    try {
      const [completedAll] = await this.estimateRepo.transaction(() =>
        Promise.all([
          this.jobRepairCleanRepo.updateMany(foundJobs),
          this.repairContRepo.update(repairCont),
        ]),
      );
      return Ok(completedAll);
    } catch (error) {
      throw error;
    }
  }
}
