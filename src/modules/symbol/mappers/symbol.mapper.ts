import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Symbol as SymbolModel } from '@prisma/client';
import { SymbolEntity } from '../domain/symbol.entity';
import { SymbolResponseDto } from '../dtos/symbol.response.dto';
@Injectable()
export class SymbolMapper
  implements Mapper<SymbolEntity, SymbolModel, SymbolResponseDto>
{
  toPersistence(entity: SymbolEntity): SymbolModel {
    const copy = entity.getProps();
    const record: SymbolModel = {
      id: copy.id,
      symbolCode: copy.symbolCode,
      symbolName: copy.symbolName,
      note: copy.note || null,

      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: SymbolModel & { inUseCount?: number }): SymbolEntity {
    return new SymbolEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        symbolCode: record.symbolCode,
        symbolName: record.symbolName,
        note: record.note || undefined,

        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: SymbolEntity): SymbolResponseDto {
    const props = entity.getProps();
    const response = new SymbolResponseDto(entity);
    response.symbolCode = props.symbolCode;
    response.symbolName = props.symbolName;
    response.note = props.note || undefined;

    return response;
  }
}
