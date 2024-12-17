import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ManageRepairContainerResult,
  ManageRepairContainerPort,
} from '../../database/repair-container.repository.port';
import { MANAGE_REPAIRCONT_REPOSITORY } from '@src/modules/manage/manage.di-token';

export class GetManageRepairContainerQuery {
  readonly statusCode?: string;
  readonly fromDate?: Date;
  readonly toDate?: Date;
  readonly operationCode?: string;

  constructor(props: GetManageRepairContainerQuery) {
    Object.assign(this, props);
  }
}

export type GetManageRepairContainerQueryResult = Result<
  ManageRepairContainerResult[],
  Error
>;

@QueryHandler(GetManageRepairContainerQuery)
export class GetManageRepairContainerQueryHandler implements IQueryHandler {
  constructor(
    @Inject(MANAGE_REPAIRCONT_REPOSITORY)
    protected readonly manageRepairContainerRepo: ManageRepairContainerPort,
  ) {}

  async execute(
    query: GetManageRepairContainerQuery,
  ): Promise<GetManageRepairContainerQueryResult> {
    const result = await this.manageRepairContainerRepo.manageRepairContainer(
      query,
    );

    return Ok(result);
  }
}
