import { Err, Ok, Result } from 'oxide.ts';
import { REPAIR_CONT_REPOSITORY } from '@modules/repair-cont/repair-cont.di-tokens';
import { RepairContRepositoryPort } from '@modules/repair-cont/database/repair-cont.repository.port';
import { RepairContEntity } from '@modules/repair-cont/domain/repair-cont.entity';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRepairContCommand } from './create-repair-cont.command';
import { ContainerRepositoryPort } from '@src/modules/container/database/container.repository.port';
import { CONTAINER_REPOSITORY } from '@src/modules/container/container.di-tokens';
import { ContainerNotFoundError } from '@src/modules/container/domain/container.error';

export type CreateRepairContServiceResult = Result<
  RepairContEntity,
  ContainerNotFoundError
>;

@CommandHandler(CreateRepairContCommand)
export class CreateRepairContService implements ICommandHandler {
  constructor(
    @Inject(CONTAINER_REPOSITORY)
    private readonly containerRepo: ContainerRepositoryPort,
    @Inject(REPAIR_CONT_REPOSITORY)
    protected readonly repairContRepo: RepairContRepositoryPort,
  ) {}

  async execute(
    command: CreateRepairContCommand,
  ): Promise<CreateRepairContServiceResult> {
    // function generateEstimateNo(): string {
    //   const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    //   const randomPart = Math.floor(1000 + Math.random() * 9000);
    //   return `${datePart}${randomPart}`;
    // }

    const props = command.getExtendedProps<CreateRepairContCommand>();

    const { idCont } = props;

    const [foundContainer] = await Promise.all([
      this.containerRepo.findOneByIdOrContNo(idCont),
    ]);
    if (foundContainer.isNone()) {
      return Err(new ContainerNotFoundError());
    }
    const containerEntity = foundContainer.unwrap();

    const repairCont = RepairContEntity.create({
      ...props,
      containerNo: containerEntity.containerNo,
      operationCode: containerEntity.operationCode,
      bookingNo: containerEntity.bookingNo,
      blNo: containerEntity.blNo,
      location:
        containerEntity.area !== null && containerEntity.area !== undefined
          ? containerEntity.area
          : `${containerEntity.block}-${containerEntity.bay}-${containerEntity.row}-${containerEntity.tier}`,
      localSizeType: containerEntity.localSizeType,
      isoSizeType: containerEntity.isoSizeType,
      conditionCode: containerEntity.conditionCode,
      classifyCode: containerEntity.classifyCode,
      conditionMachineCode: containerEntity.conditionMachineCode,
      statusCode: 'S',
      estimateNo: null,
    });
    try {
      const createdRepairCont = await this.repairContRepo.insert(repairCont);
      return Ok(createdRepairCont);
    } catch (error: any) {
      throw error;
    }
  }
}
