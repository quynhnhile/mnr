import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Prisma, Tariff as TariffModel } from '@prisma/client';
import { TariffEntity } from '../domain/tariff.entity';
import { TariffResponseDto } from '../dtos/tariff.response.dto';

@Injectable()
export class TariffMapper
  implements Mapper<TariffEntity, TariffModel, TariffResponseDto>
{
  toPersistence(entity: TariffEntity): TariffModel {
    const copy = entity.getProps();
    const record: TariffModel = {
      id: copy.id,
      // Map entity properties to record
      groupTrfCode: copy.groupTrfCode,
      compCode: copy.compCode,
      locCode: copy.locCode ? copy.locCode.join(',') : null,
      damCode: copy.damCode ? copy.damCode : null,
      repCode: copy.repCode,
      length: new Prisma.Decimal(copy.length),
      width: new Prisma.Decimal(copy.width),
      square: new Prisma.Decimal(copy.square),
      unit: copy.unit,
      quantity: copy.quantity,
      hours: new Prisma.Decimal(copy.hours),
      currency: copy.currency,
      mateAmount: new Prisma.Decimal(copy.mateAmount),
      totalAmount: new Prisma.Decimal(copy.totalAmount),
      vat: copy.vat ? new Prisma.Decimal(copy.vat) : null,
      includeVat: copy.includeVat,
      add: copy.add ? new Prisma.Decimal(copy.add) : null,
      addHours: copy.addHours ? new Prisma.Decimal(copy.addHours) : null,
      addMate: copy.addMate ? new Prisma.Decimal(copy.addMate) : null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: TariffModel): TariffEntity {
    return new TariffEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        groupTrfCode: record.groupTrfCode,
        compCode: record.compCode,
        locCode: record.locCode ? record.locCode.split(',') : [],
        damCode: record.damCode,
        repCode: record.repCode,
        length: record.length.toNumber(),
        width: record.width.toNumber(),
        square: record.square.toNumber(),
        unit: record.unit,
        quantity: record.quantity,
        hours: record.hours.toNumber(),
        currency: record.currency,
        mateAmount: record.mateAmount.toNumber(),
        totalAmount: record.totalAmount.toNumber(),
        vat: record.vat ? record.vat.toNumber() : undefined,
        includeVat: record.includeVat,
        add: record.add ? record.add.toNumber() : undefined,
        addHours: record.addHours ? record.addHours.toNumber() : undefined,
        addMate: record.addMate ? record.addMate.toNumber() : undefined,
        note: record.note || undefined,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: TariffEntity): TariffResponseDto {
    const props = entity.getProps();
    const response = new TariffResponseDto(entity);
    // Map entity properties to response DTO
    response.groupTrfCode = props.groupTrfCode;
    response.compCode = props.compCode;
    response.locCode = props.locCode ?? [];
    response.damCode = props.damCode || undefined;
    response.repCode = props.repCode;
    response.length = props.length;
    response.width = props.width;
    response.unit = props.unit;
    response.quantity = props.quantity;
    response.hours = props.hours;
    response.currency = props.currency;
    response.mateAmount = props.mateAmount;
    response.totalAmount = props.totalAmount;
    response.vat = props.vat || undefined;
    response.includeVat = props.includeVat;
    response.add = props.add || undefined;
    response.addHours = props.addHours || undefined;
    response.addMate = props.addMate || undefined;
    response.note = props.note || undefined;

    return response;
  }
}
