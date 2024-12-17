import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { RequestContextService } from '@src/libs/application/context/AppRequestContext';
import {
  ManageRepairContainerParams,
  ManageRepairContainerPort,
  ManageRepairContainerResult,
} from './repair-container.repository.port';

@Injectable()
export class ManageRepairContainerRepository
  implements ManageRepairContainerPort
{
  protected clients = new Map<string, PrismaClient>();

  constructor(private readonly clientManager: PrismaClientManager) {}
  protected async _getClient(): Promise<PrismaClient> {
    const tenantId = RequestContextService.getTenantId() ?? '';

    let client = this.clients.get(tenantId);
    if (!client) {
      client = this.clientManager.getClient(tenantId);
      this.clients.set(tenantId, client);
    }

    return client;
  }

  async manageRepairContainer(
    params: ManageRepairContainerParams,
  ): Promise<ManageRepairContainerResult[]> {
    const { statusCode, fromDate, toDate, operationCode, isRevice } = params;

    const client = await this._getClient();
    let statusField;
    switch (statusCode) {
      case 'S':
        statusField = 'ds.survey_date';
        break;
      case 'E':
        statusField = 'es.estimate_date';
        break;
      case 'A':
        statusField = 'es.approval_date';
        break;
      case 'C':
        statusField = 'rp.complete_date';
        break;
      case 'X':
        statusField = 'es.cancel_date';
        break;
    }

    const dateWhere = Prisma.sql`AND ${Prisma.raw(
      statusField,
    )}::timestamp >= ${fromDate}::timestamp AND ${Prisma.raw(
      statusField,
    )}::timestamp <= ${toDate}::timestamp`;

    const operationCodeWhere =
      operationCode !== '*'
        ? Prisma.sql`AND rp.operation_code = ${operationCode}`
        : Prisma.empty;

    const statusCodeWhere =
      statusCode !== '*'
        ? Prisma.sql`AND rp.status_code = ${statusCode}`
        : Prisma.empty;
    let isReviceWhere = Prisma.empty;
    if (isRevice != undefined && isRevice == true) {
      isReviceWhere = Prisma.sql`AND ds.is_revice = true`;
    }
    const rawQuery = Prisma.sql`
    SELECT rp.container_no,rp.estimate_no, rp.operation_code, rp.local_size_type,rp.complete_date, rp.complete_by, rp.condition_code,
          dc.date_in, dc.yard_code,
          ds.note_survey,ds.is_revice,
          es.approval_date, es.approval_by, es.estimate_by, es.estimate_date, es.note_estimate,
          SUM(ed.total) as total
    FROM DT_REPAIR_CONT rp
    LEFT JOIN DT_SURVEY ds ON rp.id = ds.id_rep
    LEFT JOIN DT_CONTAINER dc ON rp.id_cont = dc.id_cont
    LEFT JOIN DT_ESTIMATE es ON rp.id = es.id_ref 
    LEFT JOIN DT_ESTIMATE_DETAIL ed ON es.id = ed.id_estimate
    WHERE 1=1 
    ${dateWhere}
    ${operationCodeWhere}
    ${statusCodeWhere}
    ${isReviceWhere}
    GROUP BY rp.container_no, rp.estimate_no, rp.operation_code, rp.local_size_type,rp.complete_date, rp.complete_by, rp.condition_code,
          ds.note_survey, ds.is_revice,
          dc.date_in, dc.yard_code,
          es.approval_date, es.approval_by, es.estimate_by, es.estimate_date, es.note_estimate
    ORDER BY dc.date_in desc, rp.container_no`;

    const result = await client.$queryRaw<
      Array<{
        container_no: string;
        estimate_no: string;
        operation_code: string;
        local_size_type: string;
        complete_date: Date;
        complete_by: string;
        condition_code: string;
        date_in: Date;
        is_revice: boolean;
        yard_code: string;
        note_survey: string;
        approval_date: Date;
        approval_by: string;
        estimate_date: Date;
        estimate_by: string;
        note_estimate: string;
        total: Prisma.Decimal;
      }>
    >(rawQuery);

    return result.map((item) => ({
      containerNo: item.container_no,
      estimateNo: item.estimate_no,
      operationCode: item.operation_code,
      localSizeType: item.local_size_type,
      completeDate: item.complete_date,
      completeBy: item.complete_by,
      conditionCode: item.condition_code,
      dateIn: item.date_in,
      isRevice: item.is_revice,
      yardCode: item.yard_code,
      noteSurvey: item.note_survey,
      approvalDate: item.approval_date,
      approvalBy: item.approval_by,
      estimateDate: item.estimate_date,
      estimateBy: item.estimate_by,
      noteEstimate: item.note_estimate,
      total: item.total,
    }));
  }
}
