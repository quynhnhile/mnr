import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Location as LocationModel, Prisma } from '@prisma/client';
import { LocationEntity } from '../domain/location.entity';
import { LocationResponseDto } from '../dtos/location.response.dto';

@Injectable()
export class LocationMapper
  implements Mapper<LocationEntity, LocationModel, LocationResponseDto>
{
  toPersistence(entity: LocationEntity): LocationModel {
    const copy = entity.getProps();
    const record: LocationModel = {
      id: copy.id,
      locCode: copy.locCode,
      locNameEn: copy.locNameEn,
      locNameVi: copy.locNameVi || null,
      side: copy.side || null,
      size: copy.size ? new Prisma.Decimal(copy.size) : null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: LocationModel & { inUseCount?: number }): LocationEntity {
    return new LocationEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        locCode: record.locCode,
        locNameEn: record.locNameEn,
        locNameVi: record.locNameVi || null,
        side: record.side,
        size: record.size ? record.size.toNumber() : null,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: LocationEntity): LocationResponseDto {
    const props = entity.getProps();
    const response = new LocationResponseDto(entity);
    // Map entity properties to response DTO
    response.locCode = props.locCode;
    response.locNameEn = props.locNameEn;
    response.locNameVi = props.locNameVi || undefined;
    response.side = props.side || undefined;
    response.size = props.size || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
