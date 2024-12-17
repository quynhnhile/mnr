import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { ComDamRep as ComDamRepModel } from '@prisma/client';
import { ComDamRepEntity } from '../domain/com-dam-rep.entity';
import { ComDamRepResponseDto } from '../dtos/com-dam-rep.response.dto';

@Injectable()
export class ComDamRepMapper
  implements Mapper<ComDamRepEntity, ComDamRepModel, ComDamRepResponseDto>
{
  toPersistence(entity: ComDamRepEntity): ComDamRepModel {
    const copy = entity.getProps();
    const record: ComDamRepModel = {
      id: copy.id,
      // Map entity properties to record
      compCode: copy.compCode,
      damCode: copy.damCode,
      repCode: copy.repCode,
      nameEn: copy.nameEn,
      nameVi: copy.nameVi || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ComDamRepModel): ComDamRepEntity {
    return new ComDamRepEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        compCode: record.compCode,
        damCode: record.damCode,
        repCode: record.repCode,
        nameEn: record.nameEn,
        nameVi: record.nameVi,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ComDamRepEntity): ComDamRepResponseDto {
    const props = entity.getProps();
    const response = new ComDamRepResponseDto(entity);
    // Map entity properties to response DTO
    response.compCode = props.compCode;
    response.damCode = props.damCode;
    response.repCode = props.repCode;
    response.nameEn = props.nameEn;
    response.nameVi = props.nameVi || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
