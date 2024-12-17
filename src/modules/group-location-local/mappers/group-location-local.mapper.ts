import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { GroupLocationLocal as GroupLocationLocalModel } from '@prisma/client';
import { GroupLocationLocalEntity } from '../domain/group-location-local.entity';
import { GroupLocationLocalResponseDto } from '../dtos/group-location-local.response.dto';

@Injectable()
export class GroupLocationLocalMapper
  implements
    Mapper<
      GroupLocationLocalEntity,
      GroupLocationLocalModel,
      GroupLocationLocalResponseDto
    >
{
  toPersistence(entity: GroupLocationLocalEntity): GroupLocationLocalModel {
    const copy = entity.getProps();
    const record: GroupLocationLocalModel = {
      id: copy.id,
      // Map entity properties to record
      groupLocLocalCode: copy.groupLocLocalCode,
      groupLocLocalName: copy.groupLocLocalName,
      contType: copy.contType,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: GroupLocationLocalModel & { inUseCount?: number },
  ): GroupLocationLocalEntity {
    return new GroupLocationLocalEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        groupLocLocalCode: record.groupLocLocalCode,
        groupLocLocalName: record.groupLocLocalName,
        contType: record.contType,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: GroupLocationLocalEntity): GroupLocationLocalResponseDto {
    const props = entity.getProps();
    const response = new GroupLocationLocalResponseDto(entity);
    // Map entity properties to response DTO
    response.groupLocLocalCode = props.groupLocLocalCode;
    response.groupLocLocalName = props.groupLocLocalName;
    response.contType = props.contType;
    response.note = props.note;
    return response;
  }
}
