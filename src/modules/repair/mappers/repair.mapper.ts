import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Repair as RepairModel } from '@prisma/client';
import { RepairEntity } from '../domain/repair.entity';
import { RepairResponseDto } from '../dtos/repair.response.dto';

@Injectable()
export class RepairMapper
  implements Mapper<RepairEntity, RepairModel, RepairResponseDto>
{
  toPersistence(entity: RepairEntity): RepairModel {
    const copy = entity.getProps();
    const record: RepairModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      repCode: copy.repCode,
      repNameEn: copy.repNameEn,
      repNameVi: copy.repNameVi || null,
      isClean: copy.isClean,
      isRepair: copy.isRepair,
      isPti: copy.isPti,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: RepairModel & { inUseCount?: number }): RepairEntity {
    return new RepairEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        repCode: record.repCode,
        repNameEn: record.repNameEn,
        repNameVi: record.repNameVi,
        isClean: record.isClean,
        isRepair: record.isRepair,
        isPti: record.isPti,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: RepairEntity): RepairResponseDto {
    const props = entity.getProps();
    const response = new RepairResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.repCode = props.repCode;
    response.repNameEn = props.repNameEn;
    response.repNameVi = props.repNameVi || undefined;
    response.isClean = props.isClean;
    response.isRepair = props.isRepair;
    response.isPti = props.isPti;
    response.note = props.note || undefined;

    return response;
  }
}
