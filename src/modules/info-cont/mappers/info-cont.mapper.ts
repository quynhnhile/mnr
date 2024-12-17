import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { InfoCont as InfoContModel, Prisma } from '@prisma/client';
import { InfoContEntity } from '../domain/info-cont.entity';
import { InfoContResponseDto } from '../dtos/info-cont.response.dto';

@Injectable()
export class InfoContMapper
  implements Mapper<InfoContEntity, InfoContModel, InfoContResponseDto>
{
  toPersistence(entity: InfoContEntity): InfoContModel {
    const copy = entity.getProps();
    const record: InfoContModel = {
      id: copy.id,
      // Map entity properties to record
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
      containerNo: copy.containerNo,
      operationCode: copy.operationCode,
      ownerCode: copy.ownerCode || null,
      localSizeType: copy.localSizeType,
      isoSizeType: copy.isoSizeType,
      contType: copy.contType,
      contAge: copy.contAge || null,
      machineAge: copy.machineAge || null,
      machineBrand: copy.machineBrand || null,
      machineModel: copy.machineModel || null,
      tareWeight: new Prisma.Decimal(copy.tareWeight || 0),
      maxGrossWeight: new Prisma.Decimal(copy.maxGrossWeight || 0),
      net: new Prisma.Decimal(copy.net || 0),
      capacity: new Prisma.Decimal(copy.capacity || 0),
      lastTest: copy.lastTest || null,
      typeTest: copy.typeTest || null,
      note: copy.note || null,
    };

    return record;
  }

  toDomain(record: InfoContModel): InfoContEntity {
    return new InfoContEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        containerNo: record.containerNo,
        operationCode: record.operationCode,
        ownerCode: record.ownerCode || undefined,
        localSizeType: record.localSizeType,
        isoSizeType: record.isoSizeType,
        contType: record.contType,
        contAge: record.contAge || undefined,
        machineAge: record.machineAge || undefined,
        machineBrand: record.machineBrand || undefined,
        machineModel: record.machineModel || undefined,
        tareWeight: record.tareWeight?.toNumber() ?? undefined,
        maxGrossWeight: record.maxGrossWeight?.toNumber() ?? undefined,
        net: record.net?.toNumber() ?? undefined,
        capacity: record.capacity?.toNumber() ?? undefined,
        lastTest: record.lastTest || undefined,
        typeTest: record.typeTest || undefined,
        note: record.note || undefined,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: InfoContEntity): InfoContResponseDto {
    const props = entity.getProps();
    const response = new InfoContResponseDto(entity);

    response.containerNo = props.containerNo;
    response.operationCode = props.operationCode;
    response.ownerCode = props.ownerCode;
    response.localSizeType = props.localSizeType;
    response.isoSizeType = props.isoSizeType;
    response.contType = props.contType;
    response.contAge = props.contAge;
    response.machineAge = props.machineAge || undefined;
    response.machineBrand = props.machineBrand || undefined;
    response.machineModel = props.machineModel || undefined;
    response.tareWeight = props.tareWeight || undefined;
    response.maxGrossWeight = props.maxGrossWeight || undefined;
    response.net = props.net || undefined;
    response.capacity = props.capacity || undefined;
    response.lastTest = props.lastTest || undefined;
    response.typeTest = props.typeTest || undefined;
    response.note = props.note || undefined;

    return response;
  }
}
