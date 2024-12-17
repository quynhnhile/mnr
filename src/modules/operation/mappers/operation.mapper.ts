import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Operation as OperationModel } from '@prisma/client';
import { OperationEntity } from '../domain/operation.entity';
import { OperationType } from '../domain/operation.type';
import { OperationResponseDto } from '../dtos/operation.response.dto';

@Injectable()
export class OperationMapper
  implements Mapper<OperationEntity, OperationModel, OperationResponseDto>
{
  toPersistence(entity: OperationEntity): OperationModel {
    const copy = entity.getProps();
    const record: OperationModel = {
      id: copy.id,
      operationCode: copy.operationCode,
      operationName: copy.operationName,
      isEdo: copy.isEdo,
      isLocalForeign: copy.isLocalForeign,
      isActive: copy.isActive,
      moneyCredit: copy.moneyCredit || null,
      policyInfo: copy.policyInfo || null,
      cleanMethodCode: copy.cleanMethodCode || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: OperationModel & { inUseCount?: number }): OperationEntity {
    return new OperationEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        operationCode: record.operationCode,
        operationName: record.operationName,
        isEdo: record.isEdo,
        isLocalForeign: record.isLocalForeign as OperationType,
        isActive: record.isActive,
        moneyCredit: record.moneyCredit || null,
        policyInfo: record.policyInfo || null,
        cleanMethodCode: record.cleanMethodCode || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,

        // additional properties
        inUseCount: record.inUseCount,
      },
    });
  }

  toResponse(entity: OperationEntity): OperationResponseDto {
    const props = entity.getProps();
    const response = new OperationResponseDto(entity);
    response.operationCode = props.operationCode;
    response.operationName = props.operationName;
    // response.isEdo = props.isEdo;
    // response.isLocalForeign = props.isLocalForeign;
    response.isActive = props.isActive;
    response.policyInfo = props.policyInfo || undefined;
    response.cleanMethodCode = props.cleanMethodCode || undefined;
    // response.moneyCredit = props.moneyCredit || undefined;

    return response;
  }
}
