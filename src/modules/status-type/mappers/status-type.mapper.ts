import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { StatusType as StatusTypeModel } from '@prisma/client';
import { StatusTypeEntity } from '../domain/status-type.entity';
import { StatusTypeResponseDto } from '../dtos/status-type.response.dto';
@Injectable()
export class StatusTypeMapper
  implements Mapper<StatusTypeEntity, StatusTypeModel, StatusTypeResponseDto>
{
  toPersistence(entity: StatusTypeEntity): StatusTypeModel {
    const copy = entity.getProps();
    const record: StatusTypeModel = {
      id: copy.id,
      statusTypeCode: copy.statusTypeCode,
      statusTypeName: copy.statusTypeName,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: StatusTypeModel & { inUseCount?: number },
  ): StatusTypeEntity {
    return new StatusTypeEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        statusTypeCode: record.statusTypeCode,
        statusTypeName: record.statusTypeName,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: StatusTypeEntity): StatusTypeResponseDto {
    const props = entity.getProps();
    const response = new StatusTypeResponseDto(entity);
    response.statusTypeCode = props.statusTypeCode;
    response.statusTypeName = props.statusTypeName;
    response.note = props.note || undefined;

    return response;
  }
}
