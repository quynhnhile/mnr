import { None, Option, Some } from 'oxide.ts';
import { Injectable } from '@nestjs/common';
import { Prisma, Terminal as TerminalModel } from '@prisma/client';
import { PrismaMultiTenantRepositoryBase } from '@src/libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@src/libs/prisma/prisma-client-manager';
import { TerminalEntity } from '../domain/terminal.entity';
import { TerminalMapper } from '../mappers/terminal.mapper';
import { TerminalRepositoryPort } from './terminal.repository.port';

export const TerminalScalarFieldEnum = Prisma.TerminalScalarFieldEnum;

@Injectable()
export class PrismaTerminalRepository
  extends PrismaMultiTenantRepositoryBase<TerminalEntity, TerminalModel>
  implements TerminalRepositoryPort
{
  protected modelName = 'terminal';

  constructor(private prisma: PrismaClientManager, mapper: TerminalMapper) {
    super(prisma, mapper);
  }
  async findOneByIdWithInUseCount(id: bigint): Promise<Option<TerminalEntity>> {
    // Get client by context

    const result = await this.prisma[this.modelName].findFirst({
      where: { id },
    });
    if (!result) return None;

    const inUseCount = await this.countInUseValue({
      column: 'terminal_code',
      value: result.terminalCode,
      excludeTables: ['bs_terminal'],
    });

    return Some(this.mapper.toDomain({ ...result, inUseCount }));
  }
}
