import { None, Option, Some } from 'oxide.ts';
import { PrismaMultiTenantRepositoryBase } from '@libs/db/prisma-multi-tenant-repository.base';
import { PrismaClientManager } from '@libs/prisma/prisma-client-manager';
import { Injectable } from '@nestjs/common';
import { Prisma, RepairCont as RepairContModel } from '@prisma/client';
import { RepairContEntity } from '../domain/repair-cont.entity';
import { RepairContMapper } from '../mappers/repair-cont.mapper';
import {
  ContNosParams,
  ContNosResult,
  QueryInfoContByContainerNoOrEstimateNoParams,
  QueryInfoContByContainerNoOrEstimateNoResult,
  RepairContFindByIdRefInEstimateParams,
  RepairContFindOneParams,
  RepairContRepositoryPort,
  RepairContsFindByContainerNosParams,
} from './repair-cont.repository.port';

export const RepairContScalarFieldEnum = Prisma.RepairContScalarFieldEnum;

@Injectable()
export class PrismaRepairContRepository
  extends PrismaMultiTenantRepositoryBase<RepairContEntity, RepairContModel>
  implements RepairContRepositoryPort
{
  protected modelName = 'repairCont';

  constructor(private manager: PrismaClientManager, mapper: RepairContMapper) {
    super(manager, mapper);
  }

  async findOne(
    params: RepairContFindOneParams,
  ): Promise<Option<RepairContEntity>> {
    // Get client by context
    const client = await this._getClient();

    const { idCont, surveyInNo, surveyOutNo, isComplete } = params;

    const result = await client.repairCont.findFirst({
      where: {
        idCont,
        surveyInNo,
        surveyOutNo,
        isComplete,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findOneByContainerNo(
    containerNo: string,
  ): Promise<Option<RepairContEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.repairCont.findFirst({
      where: { containerNo },
      orderBy: { createdAt: 'desc' },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  async findRepairContByIdRefInEstimate(
    params: RepairContFindByIdRefInEstimateParams,
  ): Promise<Option<RepairContEntity>> {
    // Get client by context
    const client = await this._getClient();

    const result = await client.repairCont.findFirst({
      where: { ...params },
    });
    if (!result) return None;

    return Some(this.mapper.toDomain(result));
  }

  // query cont cho màn hình truy vấn thông tin cont
  async QueryInfoContainer(
    params: QueryInfoContByContainerNoOrEstimateNoParams,
  ): Promise<QueryInfoContByContainerNoOrEstimateNoResult | any> {
    const { containerNo, estimateNo } = params;
    if (!containerNo && !estimateNo) {
      return;
    }
    const client = await this._getClient();
    // Tạo điều kiện cho câu truy vấn
    let condition: Prisma.Sql | null = null;

    if (containerNo) {
      condition = Prisma.sql`rp.container_no = ${containerNo}`;
    } else if (estimateNo) {
      condition = Prisma.sql`rp.estimate_no = ${estimateNo}`;
    }
    const rawQuery = Prisma.sql`
    SELECT 
      rp.container_no, rp.order_no, rp.operation_code, 
      rp.local_size_type, rp.location,rp.condition_code, 
      rp.estimate_no, rp.status_code, rp.id_cont,
      dc.container_status_code, dc.date_in,
      ds.deposit, ds.note_survey,
      es.id as estimate_id, es.note_estimate
    FROM DT_REPAIR_CONT rp
    LEFT JOIN DT_CONTAINER dc ON rp.id_cont = dc.id_cont
    LEFT JOIN DT_SURVEY ds ON rp.id = ds.id_rep
    LEFT JOIN DT_ESTIMATE es ON rp.id = es.id_ref
    ${condition ? Prisma.sql`WHERE ${condition}` : Prisma.empty}
    ORDER BY rp.created_date desc`;
    const containerInfo = await client.$queryRaw<any>(rawQuery);

    if (!containerInfo || containerInfo.length === 0) {
      throw new Error('Container information not found.');
    }

    // Lấy chi tiết ước tính dựa trên estimate_id từ kết quả containerInfo
    const estimateId = containerInfo[0].estimate_id;

    const estimateDetailsQuery = Prisma.sql`
    SELECT estimate_no, comp_code, 
    loc_code, dam_code, rep_code, length, 
    width, quantity, unit, hours, cwo,
    labor_rate, labor_price, mate_price, total,
    currency, payer, rate, is_clean, clean_method_code,
    clean_mode_code, status_code, local_approval_date,
    local_approval_by, approval_date, approval_by,
    req_active_date, req_active_by, cancel_date, 
    cancel_by, is_opr_cancel, note 
    FROM DT_ESTIMATE_DETAIL 
    WHERE id_estimate = ${estimateId}`;
    const estimateDetails = await client.$queryRaw<any[]>(estimateDetailsQuery);

    // Ánh xạ các trường từ kết quả SQL thành DTO
    const mappedEstimateDetails = estimateDetails.map((detail) => ({
      estimateNo: detail.estimate_no,
      compCode: detail.comp_code,
      locCode: detail.loc_code,
      damCode: detail.dam_code,
      repCode: detail.rep_code,
      length: detail.length,
      width: detail.width,
      quantity: detail.quantity,
      unit: detail.unit,
      hours: detail.hours,
      cwo: detail.cwo,
      laborRate: detail.labor_rate,
      laborPrice: detail.labor_price,
      matePrice: detail.mate_price,
      total: detail.total,
      currency: detail.currency,
      payerCode: detail.payer,
      rate: detail.rate,
      isClean: detail.is_clean,
      cleanMethodCode: detail.clean_method_code,
      cleanModeCode: detail.clean_mode_code,
      statusCode: detail.status_code,
      localApprovalDate: detail.local_approval_date,
      localApprovalBy: detail.local_approval_by,
      approvalDate: detail.approval_date,
      approvalBy: detail.approval_by,
      reqActiveDate: detail.req_active_date,
      reqActiveBy: detail.req_active_by,
      cancelDate: detail.cancel_date,
      cancelBy: detail.cancel_by,
      isOprCancel: detail.is_opr_cancel,
      note: detail.note,
      jobRepairCleans: detail.job_repair_cleans,
    }));
    return {
      containerNo: containerInfo[0].container_no,
      orderNo: containerInfo[0].order_no,
      operationCode: containerInfo[0].operation_code,
      localSizeType: containerInfo[0].local_size_type,
      location: containerInfo[0].location,
      containerStatusCode: containerInfo[0].container_status_code,
      conditionCode: containerInfo[0].condition_code,
      dateIn: containerInfo[0].date_in,
      noteSurvey: containerInfo[0].note_survey,
      estimateNo: containerInfo[0].estimate_no,
      statusCode: containerInfo[0].status_code,
      noteEstimate: containerInfo[0].note_estimate,
      deposit: containerInfo[0].deposit,
      estimateDetails: mappedEstimateDetails,
    };
  }

  // find repair conts by cont nos cho màn hình cập nhật condition code và classify code
  async findRepairContsByContainerNos(
    params: RepairContsFindByContainerNosParams,
  ): Promise<RepairContEntity[]> {
    const client = await this._getClient();

    const { containerNo } = params;

    const results = await await client.repairCont.findMany({
      where: {
        containerNo: { in: containerNo },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return results.map((result) => this.mapper.toDomain(result));
  }

  // query cont by cont nos cho màn hình cập nhật dữ liệu
  async QueryContByContNos(
    params: ContNosParams,
  ): Promise<ContNosResult | any> {
    const { containerNo } = params;
    if (!containerNo) {
      return;
    }
    const client = await this._getClient();

    let containerNosWhere = Prisma.empty;

    if (containerNo) {
      containerNosWhere = Prisma.sql`rp.container_no IN (${Prisma.join(
        containerNo,
      )})`;
    }
    const rawQuery = Prisma.sql`
    SELECT 
      rp.id, rp.container_no, rp.operation_code, 
      rp.local_size_type, rp.iso_size_type, rp.classify_code, rp.condition_code, 
      rp.estimate_no, rp.complete_date, rp.complete_by,
      dc.date_in,
      ds.note_survey,
      es.note_estimate, 
      es.estimate_date, es.estimate_by,
      es.approval_date, es.approval_by, es.local_approval_date, es.local_approval_by,
      SUM(ed.total) as total
    FROM DT_REPAIR_CONT rp
    LEFT JOIN DT_CONTAINER dc ON rp.id_cont = dc.id_cont
    LEFT JOIN DT_SURVEY ds ON rp.id = ds.id_rep
    LEFT JOIN DT_ESTIMATE es ON rp.id = es.id_ref
    LEFT JOIN DT_ESTIMATE_DETAIL ed ON es.id = ed.id_estimate
    WHERE 1=1 and ${containerNosWhere}
    GROUP BY rp.id, rp.container_no, rp.operation_code, 
      rp.local_size_type, rp.iso_size_type, rp.classify_code, rp.condition_code, 
      rp.estimate_no, rp.complete_date, rp.complete_by,
      dc.date_in,
      ds.note_survey,
      es.note_estimate, 
      es.estimate_date, es.estimate_by,
      es.approval_date, es.approval_by, es.local_approval_date, es.local_approval_by`;

    const result = await client.$queryRaw<
      Array<{
        id: bigint;
        container_no: string;
        operation_code: string;
        local_size_type: string;
        iso_size_type: string;
        condition_code: string;
        classify_code: string;
        estimate_no: string;
        date_in: Date;
        note_survey: string;
        note_estimate: string;
        estimate_date: Date;
        estimate_by: string;
        approval_date: Date;
        approval_by: string;
        local_approval_date: Date;
        local_approval_by: string;
        complete_date: Date;
        complete_by: string;
        total: Prisma.Decimal;
      }>
    >(rawQuery);

    return result.map((item) => ({
      id: item.id,
      containerNo: item.container_no,
      operationCode: item.operation_code,
      localSizeType: item.local_size_type,
      isoSizeType: item.iso_size_type,
      conditionCode: item.condition_code,
      classifyCode: item.classify_code,
      estimateNo: item.estimate_no,
      dateIn: item.date_in,
      noteSurvey: item.note_survey,
      noteEstimate: item.note_estimate,
      estimateDate: item.estimate_date,
      estimateBy: item.estimate_by,
      approvalDate: item.approval_date,
      approvalBy: item.approval_by,
      localApprovalDate: item.local_approval_date,
      localApprovalBy: item.local_approval_by,
      completeDate: item.complete_date,
      completeBy: item.complete_by,
      total: item.total,
    }));
  }
}
