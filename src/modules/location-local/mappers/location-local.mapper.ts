import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { LocationLocal as LocationLocalModel } from '@prisma/client';
import { LocationLocalEntity } from '../domain/location-local.entity';
import { LocationLocalResponseDto } from '../dtos/location-local.response.dto';

@Injectable()
export class LocationLocalMapper
  implements
    Mapper<LocationLocalEntity, LocationLocalModel, LocationLocalResponseDto>
{
  toPersistence(entity: LocationLocalEntity): LocationLocalModel {
    const copy = entity.getProps();
    const record: LocationLocalModel = {
      id: copy.id,
      // Map entity properties to record
      groupLocLocalCode: copy.groupLocLocalCode,
      locLocalCode: copy.locLocalCode,
      locLocalNameEn: copy.locLocalNameEn,
      locLocalNameVi: copy.locLocalNameVi || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: LocationLocalModel): LocationLocalEntity {
    return new LocationLocalEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        groupLocLocalCode: record.groupLocLocalCode,
        locLocalCode: record.locLocalCode,
        locLocalNameEn: record.locLocalNameEn,
        locLocalNameVi: record.locLocalNameVi,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: LocationLocalEntity): LocationLocalResponseDto {
    const props = entity.getProps();
    const response = new LocationLocalResponseDto(entity);
    // Map entity properties to response DTO
    response.groupLocLocalCode = props.groupLocLocalCode;
    response.locLocalCode = props.locLocalCode;
    response.locLocalNameEn = props.locLocalNameEn;
    response.locLocalNameVi = props.locLocalNameVi;
    response.note = props.note;
    return response;
  }
}
