import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { ConfigMnROver as MnrOverModel } from '@prisma/client';
import { MnrOverEntity } from '../domain/mnr-over.entity';
import { MnrOverResponseDto } from '../dtos/mnr-over.response.dto';
@Injectable()
export class MnrOverMapper
  implements Mapper<MnrOverEntity, MnrOverModel, MnrOverResponseDto>
{
  toPersistence(entity: MnrOverEntity): MnrOverModel {
    const copy = entity.getProps();
    const record: MnrOverModel = {
      id: copy.id,
      statusTypeCode: copy.statusTypeCode,
      contType: copy.contType,
      jobModeCode: copy.jobModeCode,
      methodCode: copy.methodCode,
      startDate: copy.startDate,
      endDate: copy.endDate,
      pti: copy.pti || null,
      from: copy.from,
      to: copy.to,
      unit: copy.unit,
      quantity: copy.quantity,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: MnrOverModel): MnrOverEntity {
    return new MnrOverEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        statusTypeCode: record.statusTypeCode,
        contType: record.contType,
        jobModeCode: record.jobModeCode,
        methodCode: record.methodCode,
        startDate: record.startDate,
        endDate: record.endDate,
        pti: record.pti || null,
        from: record.from,
        to: record.to,
        unit: record.unit,
        quantity: record.quantity,
        note: record.note || null,

        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: MnrOverEntity): MnrOverResponseDto {
    const props = entity.getProps();
    const response = new MnrOverResponseDto(entity);
    response.statusTypeCode = props.statusTypeCode;
    response.contType = props.contType;
    response.jobModeCode = props.jobModeCode;
    response.methodCode = props.methodCode;
    response.startDate = props.startDate;
    response.endDate = props.endDate;
    response.pti = props.pti || undefined;
    response.from = props.from;
    response.to = props.to;
    response.unit = props.unit;
    response.quantity = props.quantity;
    response.note = props.note || undefined;

    return response;
  }
}
