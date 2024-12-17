import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { CleanMode as CleanModeModel } from '@prisma/client';
import { CleanModeEntity } from '../domain/clean-mode.entity';
import { CleanModeResponseDto } from '../dtos/clean-mode.response.dto';

@Injectable()
export class CleanModeMapper
  implements Mapper<CleanModeEntity, CleanModeModel, CleanModeResponseDto>
{
  toPersistence(entity: CleanModeEntity): CleanModeModel {
    const copy = entity.getProps();
    const record: CleanModeModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      cleanModeCode: copy.cleanModeCode,
      cleanModeName: copy.cleanModeName,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: CleanModeModel & { inUseCount?: number }): CleanModeEntity {
    return new CleanModeEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        cleanModeCode: record.cleanModeCode,
        cleanModeName: record.cleanModeName,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        // additional properties
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: CleanModeEntity): CleanModeResponseDto {
    const props = entity.getProps();
    const response = new CleanModeResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.cleanModeCode = props.cleanModeCode;
    response.cleanModeName = props.cleanModeName;
    response.note = props.note || undefined;
    return response;
  }
}
