import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { RequestContextService } from '@src/libs/application/context/AppRequestContext';
import {
  CleaningAndRepairParams,
  CleaningAndRepairResult,
  ReportCleaningAndRepairPort,
} from './cleaning-and-repair.repository.port';

@Injectable()
export class ReportCleaningAndRepairRepository
  implements ReportCleaningAndRepairPort
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

  async reportCleanAndRepair(
    params: CleaningAndRepairParams,
  ): Promise<CleaningAndRepairResult[]> {
    const {
      statusCode,
      fromDate,
      toDate,
      operationCode,
      localSizeType,
      conditionCode,
      contType,
      payerCode,
    } = params;

    const client = await this._getClient();
    let statusField;
    switch (statusCode) {
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

    const conditionCodeWhere =
      conditionCode !== '*'
        ? Prisma.sql`AND rp.condition_code = ${conditionCode}`
        : Prisma.empty;

    const localSizeTypeWhere =
      localSizeType !== '*'
        ? Prisma.sql`AND rp.local_size_type = ${localSizeType}`
        : Prisma.empty;

    let contTypeWhere = Prisma.empty;
    if (contType !== '*') {
      if (contType == 'R') {
        contTypeWhere = Prisma.sql`AND SUBSTRING(rp.iso_size_type, 3, 2) = 'R0'`;
      } else if (contType == 'T') {
        contTypeWhere = Prisma.sql`AND SUBSTRING(rp.iso_size_type, 3, 2) = 'T0'`;
      } else if (contType == 'D') {
        contTypeWhere = Prisma.sql`AND SUBSTRING(rp.iso_size_type, 3, 2) != 'R0' AND SUBSTRING(rp.iso_size_type, 3, 2) != 'T0'`;
      }
    }

    let payerWhere = Prisma.empty;
    if (payerCode !== undefined) {
      payerWhere =
        payerCode.length > 0
          ? Prisma.sql`AND ed.payer in (${Prisma.join(payerCode)})`
          : Prisma.empty;
    }

    const rawQuery = Prisma.sql`
    SELECT rp.container_no,rp.estimate_no, rp.operation_code, rp.local_size_type,rp.complete_date, rp.complete_by,
          dc.date_in, dc.yard_code,
          es.approval_date, es.approval_by, es.estimate_date, es.estimate_by, es.local_approval_date, es.local_approval_by,
          ed.is_clean, ed.payer, SUM(ed.hours) as hours, SUM(ed.quantity) as quantity, 
          SUM(ed.labor_price) as labor_price, SUM(ed.mate_price) as mate_price, SUM(ed.total) as total
    FROM DT_REPAIR_CONT rp
    LEFT JOIN DT_CONTAINER dc ON rp.id_cont = dc.id_cont
    LEFT JOIN DT_ESTIMATE es ON rp.id = es.id_ref 
    LEFT JOIN DT_ESTIMATE_DETAIL ed ON es.id = ed.id_estimate
    WHERE 1=1 
    ${dateWhere}
    ${operationCodeWhere}
    ${conditionCodeWhere}
    ${localSizeTypeWhere}
    ${contTypeWhere}
    ${payerWhere}
    AND (ed.cancel_date IS NULL)
    GROUP BY rp.container_no, rp.estimate_no, rp.operation_code, rp.local_size_type,rp.complete_date, rp.complete_by,
          dc.date_in, dc.yard_code,
          es.approval_date, es.approval_by, es.estimate_date, es.estimate_by, es.local_approval_date, es.local_approval_by,
          ed.is_clean, ed.payer
    ORDER BY dc.date_in desc, rp.container_no`;

    const result = await client.$queryRaw<
      Array<{
        container_no: string;
        estimate_no: string;
        operation_code: string;
        local_size_type: string;
        complete_date: Date;
        complete_by: string;
        date_in: Date;
        yard_code: string;
        estimate_date: Date;
        estimate_by: string;
        local_approval_date: Date;
        local_approval_by: string;
        approval_date: Date;
        approval_by: string;
        is_clean: boolean;
        payer: string;
        hours: Prisma.Decimal;
        quantity: number;
        labor_price: Prisma.Decimal;
        mate_price: Prisma.Decimal;
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
      dateIn: item.date_in,
      yardCode: item.yard_code,
      estimateDate: item.estimate_date,
      estimateBy: item.estimate_by,
      localApprovalDate: item.local_approval_date,
      localApprovalBy: item.local_approval_by,
      approvalDate: item.approval_date,
      approvalBy: item.approval_by,
      isClean: item.is_clean,
      payerCode: item.payer,
      hours: item.hours,
      quantity: item.quantity,
      laborPrice: item.labor_price,
      matePrice: item.mate_price,
      total: item.total,
    }));
  }
}
