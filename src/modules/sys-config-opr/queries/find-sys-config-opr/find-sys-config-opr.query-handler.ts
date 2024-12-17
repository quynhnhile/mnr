import { Err, Ok, Result } from 'oxide.ts';
import { SYS_CONFIG_OPR_REPOSITORY } from '@modules/sys-config-opr/sys-config-opr.di-tokens';
import { SysConfigOprRepositoryPort } from '@modules/sys-config-opr/database/sys-config-opr.repository.port';
import { SysConfigOprEntity } from '@modules/sys-config-opr/domain/sys-config-opr.entity';
import { SysConfigOprNotFoundError } from '@modules/sys-config-opr/domain/sys-config-opr.error';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindSysConfigOprQuery {
  sysConfigOprId: bigint;

  constructor(public readonly id: bigint) {
    this.sysConfigOprId = id;
  }
}

export type FindSysConfigOprQueryResult = Result<SysConfigOprEntity, SysConfigOprNotFoundError>;

@QueryHandler(FindSysConfigOprQuery)
export class FindSysConfigOprQueryHandler implements IQueryHandler {
  constructor(
    @Inject(SYS_CONFIG_OPR_REPOSITORY)
    protected readonly sysConfigOprRepo: SysConfigOprRepositoryPort
  ) {}

  async execute(query: FindSysConfigOprQuery): Promise<FindSysConfigOprQueryResult> {
    const found = await this.sysConfigOprRepo.findOneById(query.sysConfigOprId);
    if (found.isNone()) return Err(new SysConfigOprNotFoundError());

    return Ok(found.unwrap());
  }
}
