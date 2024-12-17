import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { ContSizeMap as ContSizeMapModel } from '@prisma/client';
import { ContSizeMapEntity } from '../domain/cont-size-map.entity';
import { ContSizeMapResponseDto } from '../dtos/cont-size-map.response.dto';

@Injectable()
export class ContSizeMapMapper
  implements
    Mapper<ContSizeMapEntity, ContSizeMapModel, ContSizeMapResponseDto>
{
  toPersistence(entity: ContSizeMapEntity): ContSizeMapModel {
    const copy = entity.getProps();
    const record: ContSizeMapModel = {
      operationCode: copy.operationCode,
      localSizeType: copy.localSizeType,
      isoSizeType: copy.isoSizeType,
      size: copy.size || null,
      height: copy.height || null,
      contType: copy.contType || null,
      contTypeName: copy.contTypeName || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
      id: copy.id,
    };

    return record;
  }

  toDomain(record: ContSizeMapModel): ContSizeMapEntity {
    return new ContSizeMapEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        operationCode: record.operationCode,
        localSizeType: record.localSizeType,
        isoSizeType: record.isoSizeType,
        size: record.size,
        height: record.height,
        contType: record.contType,
        contTypeName: record.contTypeName || undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
    });
  }

  toResponse(entity: ContSizeMapEntity): ContSizeMapResponseDto {
    const props = entity.getProps();
    const response = new ContSizeMapResponseDto(entity);

    response.operationCode = props.operationCode;
    response.localSizeType = props.localSizeType;
    response.isoSizeType = props.isoSizeType;
    response.size = props.size || undefined;
    response.height = props.height || undefined;
    response.contType = props.contType || undefined;
    response.contTypeName = props.contTypeName || undefined;
    return response;
  }
}
