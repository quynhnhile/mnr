import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Agent as AgentModel } from '@prisma/client';
import { AgentEntity } from '../domain/agent.entity';
import { AgentResponseDto } from '../dtos/agent.response.dto';
@Injectable()
export class AgentMapper
  implements Mapper<AgentEntity, AgentModel, AgentResponseDto>
{
  toPersistence(entity: AgentEntity): AgentModel {
    const copy = entity.getProps();
    const record: AgentModel = {
      id: copy.id,
      operationCode: copy.operationCode,
      agentCode: copy.agentCode,
      agentName: copy.agentName,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy ?? null,
    };

    return record;
  }

  toDomain(record: AgentModel): AgentEntity {
    return new AgentEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        operationCode: record.operationCode,
        agentCode: record.agentCode,
        agentName: record.agentName,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: AgentEntity): AgentResponseDto {
    const props = entity.getProps();
    const response = new AgentResponseDto(entity);
    response.operationCode = props.operationCode;
    response.agentCode = props.agentCode;
    response.agentName = props.agentName;
    return response;
  }
}
