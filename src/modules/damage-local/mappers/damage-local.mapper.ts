import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { DamageLocal as DamageLocalModel } from '@prisma/client';
import { DamageLocalEntity } from '../domain/damage-local.entity';
import { DamageLocalResponseDto } from '../dtos/damage-local.response.dto';

@Injectable()
export class DamageLocalMapper
  implements
    Mapper<DamageLocalEntity, DamageLocalModel, DamageLocalResponseDto>
{
  toPersistence(entity: DamageLocalEntity): DamageLocalModel {
    const copy = entity.getProps();
    const record: DamageLocalModel = {
      id: copy.id,
      // Map entity properties to record
      damLocalCode: copy.damLocalCode,
      damLocalNameEn: copy.damLocalNameEn,
      damLocalNameVi: copy.damLocalNameVi || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: DamageLocalModel): DamageLocalEntity {
    return new DamageLocalEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        damLocalCode: record.damLocalCode,
        damLocalNameEn: record.damLocalNameEn,
        damLocalNameVi: record.damLocalNameVi,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: DamageLocalEntity): DamageLocalResponseDto {
    const props = entity.getProps();
    const response = new DamageLocalResponseDto(entity);
    // Map entity properties to response DTO
    response.damLocalCode = props.damLocalCode;
    response.damLocalNameEn = props.damLocalNameEn;
    response.damLocalNameVi = props.damLocalNameVi;
    response.note = props.note;
    return response;
  }
}
