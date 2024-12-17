import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { LocalDmgDetail as LocalDmgDetailModel } from '@prisma/client';
import { LocalDmgDetailEntity } from '../domain/local-dmg-detail.entity';
import { LocalDmgDetailResponseDto } from '../dtos/local-dmg-detail.response.dto';

@Injectable()
export class LocalDmgDetailMapper
  implements
    Mapper<
      LocalDmgDetailEntity,
      LocalDmgDetailModel,
      LocalDmgDetailResponseDto
    >
{
  toPersistence(entity: LocalDmgDetailEntity): LocalDmgDetailModel {
    const copy = entity.getProps();
    const record: LocalDmgDetailModel = {
      id: copy.id,
      // Map entity properties to record
      idSurvey: copy.idSurvey,
      idCont: copy.idCont,
      damLocalCode: copy.damLocalCode,
      locLocalCode: copy.locLocalCode,
      symbolCode: copy.symbolCode,
      size: copy.size,
      damDesc: copy.damDesc || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: LocalDmgDetailModel): LocalDmgDetailEntity {
    return new LocalDmgDetailEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        idSurvey: record.idSurvey,
        idCont: record.idCont,
        damLocalCode: record.damLocalCode,
        locLocalCode: record.locLocalCode,
        symbolCode: record.symbolCode,
        size: record.size,
        damDesc: record.damDesc,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: LocalDmgDetailEntity): LocalDmgDetailResponseDto {
    const props = entity.getProps();
    const response = new LocalDmgDetailResponseDto(entity);
    // Map entity properties to response DTO
    response.idSurvey = props.idSurvey.toString();
    response.idCont = props.idCont;
    response.damLocalCode = props.damLocalCode;
    response.locLocalCode = props.locLocalCode;
    response.symbolCode = props.symbolCode;
    response.size = props.size;
    response.damDesc = props.damDesc;
    response.note = props.note;
    return response;
  }
}
