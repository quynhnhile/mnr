import { Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { RepairContNotFoundError } from '@modules/repair-cont/domain/repair-cont.error';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateConditionClassifyCodeCommand } from './update-condition-classify-code.command';
import { CONTAINER_REPOSITORY } from '@src/modules/container/container.di-tokens';
import { ContainerRepositoryPort } from '@src/modules/container/database/container.repository.port';

export type UpdateRepairContServiceResult = Result<
  RepairContEntity,
  RepairContNotFoundError
>;

@CommandHandler(UpdateConditionClassifyCodeCommand)
export class UpdateConditionClassifyCodeService implements ICommandHandler {
  constructor(
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
    @Inject(CONTAINER_REPOSITORY)
    protected readonly containerRepo: ContainerRepositoryPort,
  ) {}

  async execute(command: UpdateConditionClassifyCodeCommand): Promise<boolean> {
    // Trả về true hoặc false
    try {
      const results = await Promise.all(
        command.dataUpdate.map(async (repairCont) => {
          const [foundRepairCont] = await Promise.all([
            this.repairContRepo.findOneById(BigInt(repairCont.id)),
          ]);

          if (foundRepairCont.isNone()) {
            return false;
          }

          const repairContEntity = foundRepairCont.unwrap();
          const foundContainer = await this.containerRepo.findOneByIdOrContNo(
            repairContEntity.idCont,
          );
          if (foundContainer.isNone()) {
            return false;
          }
          repairContEntity.update({
            conditionCode: repairCont.conditionCode,
            classifyCode: repairCont.classifyCode,
            updatedBy: repairCont.updatedBy,
          });

          const containerEntity = foundContainer.unwrap();
          containerEntity.update({
            conditionCode: repairCont.conditionCode,
            classifyCode: repairCont.classifyCode,
            updatedBy: repairCont.updatedBy,
          });

          try {
            await this.repairContRepo.update(repairContEntity);
            await this.containerRepo.update(containerEntity);
          } catch (error: any) {
            console.error('Update error:', error);
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
      console.error('Unexpected error:', error);
      return false;
    }
  }
}
