import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPORT_CLEANINGANDREPAIR_REPOSITORY } from '@src/modules/report/report.di-token';
import {
  CleaningAndRepairResult,
  ReportCleaningAndRepairPort,
} from '../../database/cleaning-and-repair.repository.port';

export class GetCleaningAndRepairQuery {
  readonly statusCode?: string;
  readonly fromDate?: Date;
  readonly toDate?: Date;
  readonly operationCode?: string;
  readonly localSizeType?: string;
  readonly conditionCode?: string;
  readonly contType?: string;
  readonly payerCode: string[];

  constructor(props: GetCleaningAndRepairQuery) {
    Object.assign(this, props);
  }
}

export type GetCleaningAndRepairQueryResult = Result<
  CleaningAndRepairResult[],
  Error
>;

@QueryHandler(GetCleaningAndRepairQuery)
export class GetCleaningAndRepairQueryHandler implements IQueryHandler {
  constructor(
    @Inject(REPORT_CLEANINGANDREPAIR_REPOSITORY)
    protected readonly cleaningAndRepairRepo: ReportCleaningAndRepairPort,
  ) {}

  async execute(
    query: GetCleaningAndRepairQuery,
  ): Promise<GetCleaningAndRepairQueryResult> {
    const result = await this.cleaningAndRepairRepo.reportCleanAndRepair(query);

    return Ok(result);
  }
}
