import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Prisma, TariffGroup as TariffGroupModel } from '@prisma/client';
import { TariffGroupEntity } from '../domain/tariff-group.entity';
import { TariffGroupResponseDto } from '../dtos/tariff-group.response.dto';

@Injectable()
export class TariffGroupMapper
  implements
    Mapper<TariffGroupEntity, TariffGroupModel, TariffGroupResponseDto>
{
  toPersistence(entity: TariffGroupEntity): TariffGroupModel {
    const copy = entity.getProps();
    const record: TariffGroupModel = {
      id: copy.id,
      // Map entity properties to record
      groupTrfCode: copy.groupTrfCode,
      groupTrfName: copy.groupTrfName,
      laborRate: new Prisma.Decimal(copy.laborRate),
      isDry: copy.isDry,
      isReefer: copy.isReefer,
      isTank: copy.isTank,
      operationCode: copy.operationCode ? copy.operationCode.join(',') : null,
      vendorCode: copy.vendorCode || null,
      isTerminal: copy.isTerminal || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: TariffGroupModel & { inUseCount?: number },
  ): TariffGroupEntity {
    return new TariffGroupEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        groupTrfCode: record.groupTrfCode,
        groupTrfName: record.groupTrfName,
        laborRate: record.laborRate.toNumber(),
        isDry: record.isDry,
        isReefer: record.isReefer,
        isTank: record.isTank,
        operationCode: record.operationCode
          ? record.operationCode.split(',')
          : [],
        vendorCode: record.vendorCode,
        isTerminal: record.isTerminal,
        note: record.note,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additonal props
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: TariffGroupEntity): TariffGroupResponseDto {
    const props = entity.getProps();
    const response = new TariffGroupResponseDto(entity);
    // Map entity properties to response DTO
    response.groupTrfCode = props.groupTrfCode;
    response.groupTrfName = props.groupTrfName;
    response.laborRate = props.laborRate;
    response.isDry = props.isDry;
    response.isReefer = props.isReefer;
    response.isTank = props.isTank;
    response.operationCode = props.operationCode ?? [];
    response.vendorCode = props.vendorCode;
    response.isTerminal = props.isTerminal;
    response.note = props.note;

    return response;
  }
}
