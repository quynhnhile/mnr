import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { CleanMethod as CleanMethodModel } from '@prisma/client';
import { CleanMethodEntity } from '../domain/clean-method.entity';
import { CleanMethodResponseDto } from '../dtos/clean-method.response.dto';

@Injectable()
export class CleanMethodMapper
  implements
    Mapper<CleanMethodEntity, CleanMethodModel, CleanMethodResponseDto>
{
  toPersistence(entity: CleanMethodEntity): CleanMethodModel {
    const copy = entity.getProps();
    const record: CleanMethodModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      cleanMethodCode: copy.cleanMethodCode,
      cleanMethodName: copy.cleanMethodName,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: CleanMethodModel & { inUseCount?: number },
  ): CleanMethodEntity {
    return new CleanMethodEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        cleanMethodCode: record.cleanMethodCode,
        cleanMethodName: record.cleanMethodName,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        // additional properties
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: CleanMethodEntity): CleanMethodResponseDto {
    const props = entity.getProps();
    const response = new CleanMethodResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.cleanMethodCode = props.cleanMethodCode;
    response.cleanMethodName = props.cleanMethodName;
    response.note = props.note || undefined;
    return response;
  }
}
