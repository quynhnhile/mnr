import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Vendor as VendorModel } from '@prisma/client';
import { VendorEntity } from '../domain/vendor.entity';
import { VendorResponseDto } from '../dtos/vendor.response.dto';

@Injectable()
export class VendorMapper
  implements Mapper<VendorEntity, VendorModel, VendorResponseDto>
{
  toPersistence(entity: VendorEntity): VendorModel {
    const copy = entity.getProps();
    const record: VendorModel = {
      id: copy.id,
      operationCode: copy.operationCode ?? null,
      vendorTypeCode: copy.vendorTypeCode,
      vendorCode: copy.vendorCode,
      vendorName: copy.vendorName ?? null,
      isActive: copy.isActive !== undefined ? copy.isActive : null,
      note: copy.note ?? null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy ?? null,
    };

    return record;
  }

  toDomain(record: VendorModel & { inUseCount?: number }): VendorEntity {
    return new VendorEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        operationCode: record.operationCode ?? null,
        vendorTypeCode: record.vendorTypeCode,
        vendorCode: record.vendorCode,
        vendorName: record.vendorName ?? null,
        isActive: record.isActive !== null ? record.isActive : undefined,
        note: record.note ?? null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: VendorEntity): VendorResponseDto {
    const props = entity.getProps();
    const response = new VendorResponseDto(entity);
    response.operationCode = props.operationCode ?? undefined;
    response.vendorTypeCode = props.vendorTypeCode;
    response.vendorCode = props.vendorCode;
    response.vendorName = props.vendorName ?? undefined;
    response.isActive = props.isActive;
    response.note = props.note ?? undefined;
    return response;
  }
}
