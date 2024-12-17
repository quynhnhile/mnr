import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Region as RegionModel } from '@prisma/client';
import { RegionEntity } from '../domain/region.entity';
import { RegionResponseDto } from '../dtos/region.response.dto';

@Injectable()
export class RegionMapper
  implements Mapper<RegionEntity, RegionModel, RegionResponseDto>
{
  toPersistence(entity: RegionEntity): RegionModel {
    const copy = entity.getProps();
    const record: RegionModel = {
      id: copy.id,
      regionCode: copy.regionCode,
      regionName: copy.regionName,
      note: copy.note ?? null,
      sort: copy.sort ?? 99,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy ?? null,
    };

    return record;
  }

  toDomain(record: RegionModel & { inUseCount?: number }): RegionEntity {
    return new RegionEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        regionCode: record.regionCode,
        regionName: record.regionName,
        note: record.note ?? null,
        sort: record.sort ?? null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        inUseCount: record.inUseCount ?? 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: RegionEntity): RegionResponseDto {
    const props = entity.getProps();
    const response = new RegionResponseDto(entity);
    response.regionCode = props.regionCode;
    response.regionName = props.regionName;
    response.note = props.note ?? undefined;
    response.sort = props.sort ?? 99;

    return response;
  }
}
