import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Agent as AgentModel, Prisma } from '@prisma/client';
import { AgentEntity } from '../domain/agent.entity';
import { AgentMapper } from '../mappers/agent.mapper';
import { AgentRepositoryPort } from './agent.repository.port';

export const AgentScalarFieldEnum = Prisma.AgentScalarFieldEnum;

@Injectable()
export class PrismaAgentRepository
  extends PrismaMultiTenantRepositoryBase<AgentEntity, AgentModel>
  implements AgentRepositoryPort
{
  protected modelName = 'agent';

  constructor(private manager: PrismaClientManager, mapper: AgentMapper) {
    super(manager, mapper);
  }

  async findOneByCode(code: string): Promise<Option<AgentEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.agent.findFirst({
      where: { agentCode: code },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findManyByCodes(codes: string[]): Promise<AgentEntity[]> {
    // Get client by context
    const client = await this._getClient();

    const results = await client.agent.findMany({
      where: { agentCode: { in: codes } },
    });

    return results.map((result) => this.mapper.toDomain(result));
  }
}
