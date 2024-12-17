import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Condition as ConditionModel } from '@prisma/client';
import { ConditionEntity } from '../domain/condition.entity';
import { ConditionResponseDto } from '../dtos/condition.response.dto';

@Injectable()
export class ConditionMapper
  implements Mapper<ConditionEntity, ConditionModel, ConditionResponseDto>
{
  toPersistence(entity: ConditionEntity): ConditionModel {
    const copy = entity.getProps();
    const record: ConditionModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      conditionCode: copy.conditionCode,
      conditionName: copy.conditionName,
      isDamage: copy.isDamage,
      isMachine: copy.isMachine,
      mappingCode: copy.mappingCode || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ConditionModel & { inUseCount?: number }): ConditionEntity {
    return new ConditionEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        conditionCode: record.conditionCode,
        conditionName: record.conditionName,
        isDamage: record.isDamage,
        isMachine: record.isMachine,
        mappingCode: record.mappingCode,
        note: record.note || null,
        inUseCount: record.inUseCount,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ConditionEntity): ConditionResponseDto {
    const props = entity.getProps();
    const response = new ConditionResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.conditionCode = props.conditionCode;
    response.conditionName = props.conditionName;
    response.isDamage = props.isDamage;
    response.isMachine = props.isMachine;
    response.mappingCode = props.mappingCode || undefined;
    response.note = props.note || null;
    return response;
  }
}
