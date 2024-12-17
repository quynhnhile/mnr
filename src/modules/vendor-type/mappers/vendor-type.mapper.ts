import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { VendorType as VendorTypeModel } from '@prisma/client';
import { VendorTypeEntity } from '../domain/vendor-type.entity';
import { VendorTypeResponseDto } from '../dtos/vendor-type.response.dto';
@Injectable()
export class VendorTypeMapper
  implements Mapper<VendorTypeEntity, VendorTypeModel, VendorTypeResponseDto>
{
  toPersistence(entity: VendorTypeEntity): VendorTypeModel {
    const copy = entity.getProps();
    const record: VendorTypeModel = {
      id: copy.id,
      vendorTypeCode: copy.vendorTypeCode,
      vendorTypeName: copy.vendorTypeName,
      note: copy.note ?? null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy ?? null,
    };

    return record;
  }

  toDomain(
    record: VendorTypeModel & { inUseCount?: number },
  ): VendorTypeEntity {
    return new VendorTypeEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        vendorTypeCode: record.vendorTypeCode,
        vendorTypeName: record.vendorTypeName,
        note: record.note ?? null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount || 0,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: VendorTypeEntity): VendorTypeResponseDto {
    const props = entity.getProps();
    const response = new VendorTypeResponseDto(entity);
    response.vendorTypeCode = props.vendorTypeCode;
    response.vendorTypeName = props.vendorTypeName;
    response.note = props.note ?? undefined;
    return response;
  }
}
