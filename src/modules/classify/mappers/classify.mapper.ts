import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Classify as ClassifyModel } from '@prisma/client';
import { ClassifyEntity } from '../domain/classify.entity';
import { ClassifyResponseDto } from '../dtos/classify.response.dto';

@Injectable()
export class ClassifyMapper
  implements Mapper<ClassifyEntity, ClassifyModel, ClassifyResponseDto>
{
  toPersistence(entity: ClassifyEntity): ClassifyModel {
    const copy = entity.getProps();
    const record: ClassifyModel = {
      id: copy.id,
      // Map entity properties to record
      operationCode: copy.operationCode,
      classifyCode: copy.classifyCode,
      classifyName: copy.classifyName,
      mappingCode: copy.mappingCode || null,
      note: copy.note || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ClassifyModel & { inUseCount?: number }): ClassifyEntity {
    return new ClassifyEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        operationCode: record.operationCode,
        classifyCode: record.classifyCode,
        classifyName: record.classifyName,
        mappingCode: record.mappingCode,
        note: record.note || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ClassifyEntity): ClassifyResponseDto {
    const props = entity.getProps();
    const response = new ClassifyResponseDto(entity);
    // Map entity properties to response DTO
    response.operationCode = props.operationCode;
    response.classifyCode = props.classifyCode;
    response.classifyName = props.classifyName;
    response.mappingCode = props.mappingCode || undefined;
    response.note = props.note || undefined;
    return response;
  }
}
