import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Component as ComponentModel } from '@prisma/client';
import { ComponentEntity } from '../domain/component.entity';
import { ComponentResponseDto } from '../dtos/component.response.dto';

@Injectable()
export class ComponentMapper
  implements Mapper<ComponentEntity, ComponentModel, ComponentResponseDto>
{
  toPersistence(entity: ComponentEntity): ComponentModel {
    const copy = entity.getProps();
    const record: ComponentModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode || null,
      compCode: copy.compCode,
      compNameEn: copy.compNameEn,
      compNameVi: copy.compNameVi || null,
      assembly: copy.assembly || null,
      side: copy.side || null,
      contType: copy.contType || null,
      materialCode: copy.materialCode || null,
      isMachine: copy.isMachine || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ComponentModel & { inUseCount?: number }): ComponentEntity {
    return new ComponentEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode || null,
        compCode: record.compCode,
        compNameEn: record.compNameEn,
        compNameVi: record.compNameVi,
        assembly: record.assembly,
        side: record.side,
        contType: record.contType,
        materialCode: record.materialCode,
        isMachine: record.isMachine || null,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ComponentEntity): ComponentResponseDto {
    const props = entity.getProps();
    const response = new ComponentResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode || undefined;
    response.compCode = props.compCode;
    response.compNameEn = props.compNameEn;
    response.compNameVi = props.compNameVi || undefined;
    response.assembly = props.assembly || undefined;
    response.side = props.side || undefined;
    response.contType = props.contType || undefined;
    response.materialCode = props.materialCode || undefined;
    response.isMachine = props.isMachine || undefined;
    response.note = props.note || undefined;

    return response;
  }
}
