import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Damage as DamageModel } from '@prisma/client';
import { DamageEntity } from '../domain/damage.entity';
import { DamageResponseDto } from '../dtos/damage.response.dto';

@Injectable()
export class DamageMapper
  implements Mapper<DamageEntity, DamageModel, DamageResponseDto>
{
  toPersistence(entity: DamageEntity): DamageModel {
    const copy = entity.getProps();
    const record: DamageModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode || null,
      damCode: copy.damCode,
      damNameEn: copy.damNameEn,
      damNameVi: copy.damNameVi || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: DamageModel & { inUseCount?: number }): DamageEntity {
    return new DamageEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode || null,
        damCode: record.damCode,
        damNameEn: record.damNameEn,
        damNameVi: record.damNameVi,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        // additional properties
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: DamageEntity): DamageResponseDto {
    const props = entity.getProps();
    const response = new DamageResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode || undefined;
    response.damCode = props.damCode;
    response.damNameEn = props.damNameEn;
    response.damNameVi = props.damNameVi || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
