import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Prisma, SysConfigOpr as SysConfigOprModel } from '@prisma/client';
import { SysConfigOprEntity } from '../domain/sys-config-opr.entity';
import { SysConfigOprResponseDto } from '../dtos/sys-config-opr.response.dto';

@Injectable()
export class SysConfigOprMapper
  implements
    Mapper<SysConfigOprEntity, SysConfigOprModel, SysConfigOprResponseDto>
{
  toPersistence(entity: SysConfigOprEntity): SysConfigOprModel {
    const copy = entity.getProps();
    const record: SysConfigOprModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      policyInfo: copy.policyInfo || null,
      discountRate: copy.discountRate
        ? new Prisma.Decimal(copy.discountRate)
        : null,
      amount: copy.amount ? new Prisma.Decimal(copy.amount) : null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: SysConfigOprModel): SysConfigOprEntity {
    return new SysConfigOprEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        policyInfo: record.policyInfo,
        discountRate: record.discountRate?.toNumber(),
        amount: record.amount?.toNumber(),
        note: record.note || undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: SysConfigOprEntity): SysConfigOprResponseDto {
    const props = entity.getProps();
    const response = new SysConfigOprResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.policyInfo = props.policyInfo;
    response.discountRate = props.discountRate;
    response.amount = props.amount;
    response.note = props.note;
    return response;
  }
}
