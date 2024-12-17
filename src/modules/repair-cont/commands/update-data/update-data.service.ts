import { Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDataCommand } from './update-data.command';
import { ESTIMATE_REPOSITORY } from '@src/modules/estimate/estimate.di-tokens';
import { EstimateRepositoryPort } from '@src/modules/estimate/database/estimate.repository.port';
import { CONTAINER_REPOSITORY } from '@src/modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@src/modules/container/database/container.repository.port';

export type UpdateDataServiceResult = Result<
  RepairContEntity,
  RepairContNotFoundError
>;

@CommandHandler(UpdateDataCommand)
export class UpdateDataService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
    @Inject(ESTIMATE_REPOSITORY)
    protected readonly estimateRepo: EstimateRepositoryPort,
  ) {}

  async execute(command: UpdateDataCommand): Promise<boolean> {
    // Trả về true hoặc false
    try {
      const results = await Promise.all(
        command.dataUpdate.map(async (data) => {
          const [foundRepairCont, foundEstimate] = await Promise.all([
            this.repairContRepo.findOneById(BigInt(data.id)),
            this.estimateRepo.findOneByIdRef(BigInt(data.id)),
          ]);

          if (foundRepairCont.isNone() || foundEstimate.isNone()) {
            console.log('không tìm thấy repair cont');
            return false;
          }

          if (data.completeDate) {
            data.statusCode = 'C';
            data.completeBy = data.updatedBy;
          } else {
            delete data.completeDate;
            delete data.completeBy;
            if (data.approvalDate) {
              data.approvalBy = data.updatedBy;
              data.statusCode = 'A';
            } else {
              delete data.approvalDate;
              if (data.estimateDate) {
                data.estimateBy = data.estimateBy;
                data.statusCode = 'E';
              }
            }
          }
          console.log('check data: ', data);
          const repairContEntity = foundRepairCont.unwrap();
          const estimateEntity = foundEstimate.unwrap();
          const foundContainer = await this.containerRepo.findOneByIdOrContNo(
            repairContEntity.idCont,
          );
          const containerEntity = foundContainer.unwrap();
          containerEntity.update({
            conditionCode: data.conditionCode,
            classifyCode: data.classifyCode,
            updatedBy: data.updatedBy,
          });
          repairContEntity.update({
            conditionCode: data.conditionCode,
            classifyCode: data.classifyCode,
            statusCode: data.statusCode,
            completeBy: data.completeBy ?? null,
            completeDate: data.completeDate ?? null,
            updatedBy: data.updatedBy,
          });
          estimateEntity.update({
            estimateBy: data.estimateBy ?? null,
            estimateDate: data.estimateDate ?? null,
            approvalBy: data.approvalBy ?? null,
            approvalDate: data.approvalDate ?? null,
            noteEstimate: data.noteEstimate,
            updatedBy: data.updatedBy,
          });
          console.log('chek repairContEntity: ', repairContEntity);
          try {
            await this.repairContRepo.update(repairContEntity);
            await this.containerRepo.update(containerEntity);
            await this.estimateRepo.update(estimateEntity);
          } catch (error: any) {
            console.log('Update error:', error);
            return false;
          }

          return true;
        }),
      );

      if (results.includes(false)) {
        return false;
      }

      return true;
    } catch (error) {
      console.log('Unexpected error:', error);
      return false;
    }
  }
}
