import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Payer as PayerModel } from '@prisma/client';
import { PayerEntity } from '../domain/payer.entity';
import { PayerResponseDto } from '../dtos/payer.response.dto';
@Injectable()
export class PayerMapper
  implements Mapper<PayerEntity, PayerModel, PayerResponseDto>
{
  toPersistence(entity: PayerEntity): PayerModel {
    const copy = entity.getProps();
    const record: PayerModel = {
      id: copy.id,
      payerCode: copy.payerCode,
      payerName: copy.payerName,
      mappingTos: copy.mappingTos,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: PayerModel & { inUseCount?: number }): PayerEntity {
    return new PayerEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        payerCode: record.payerCode,
        payerName: record.payerName,
        mappingTos: record.mappingTos,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: PayerEntity): PayerResponseDto {
    const props = entity.getProps();
    const response = new PayerResponseDto(entity);

    response.payerCode = props.payerCode;
    response.payerName = props.payerName;
    response.mappingTos = props.mappingTos;
    response.note = props.note || undefined;

    return response;
  }
}
