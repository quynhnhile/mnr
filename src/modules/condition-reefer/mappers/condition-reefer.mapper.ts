import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { ConditionReefer as ConditionReeferModel } from '@prisma/client';
import { ConditionReeferEntity } from '../domain/condition-reefer.entity';
import { ConditionReeferResponseDto } from '../dtos/condition-reefer.response.dto';

@Injectable()
export class ConditionReeferMapper
  implements
    Mapper<
      ConditionReeferEntity,
      ConditionReeferModel,
      ConditionReeferResponseDto
    >
{
  toPersistence(entity: ConditionReeferEntity): ConditionReeferModel {
    const copy = entity.getProps();
    const record: ConditionReeferModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      conditionCode: copy.conditionCode,
      conditionMachineCode: copy.conditionMachineCode,
      isDamage: copy.isDamage,
      mappingCode: copy.mappingCode,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ConditionReeferModel): ConditionReeferEntity {
    return new ConditionReeferEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        conditionCode: record.conditionCode,
        conditionMachineCode: record.conditionMachineCode,
        isDamage: record.isDamage,
        mappingCode: record.mappingCode,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ConditionReeferEntity): ConditionReeferResponseDto {
    const props = entity.getProps();
    const response = new ConditionReeferResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.conditionCode = props.conditionCode;
    response.conditionMachineCode = props.conditionMachineCode;
    response.isDamage = props.isDamage;
    response.mappingCode = props.mappingCode;
    response.note = props.note;
    return response;
  }
}
