import { Option } from 'oxide.ts';
import { RepositoryPort } from '@libs/ddd';
import { Prisma } from '@prisma/client';
import { EstimateDetailResponseDto } from '@src/modules/estimate/dtos/estimate-detail.response.dto';
import { RepairContEntity } from '../domain/repair-cont.entity';

export interface RepairContFindOneParams {
  idCont: string;
  surveyInNo?: string | null;
  surveyOutNo?: string | null;
  isComplete?: boolean;
}

export interface RepairContFindByIdRefInEstimateParams {
  id: bigint;
}

export interface QueryInfoContByContainerNoOrEstimateNoParams {
  containerNo?: string;
  estimateNo?: string;
}

export interface QueryInfoContByContainerNoOrEstimateNoResult {
  containerNo: string;
  orderNo: string;
  operationCode: string;
  localSizeType: string;
  location: string;
  containerStatusCode: string;
  conditionCode: string;
  dateIn?: Date;
  noteSurvey?: string;
  estimateNo: string;
  statusCode: string;
  noteEstimate?: string;
  deposit?: number;
  estimateDetails: EstimateDetailResponseDto[];
}

export interface RepairContsFindByContainerNosParams {
  containerNo: string[];
}

export interface ContNosParams {
  containerNo: string[];
}

export interface ContNosResult {
  id: number;
  containerNo: string;
  estimateNo: string;
  operationCode: string;
  localSizeType: string;
  isoSizeType: string;
  conditionCode: string;
  classifyCode: string;
  dateIn: Date;
  noteSurvey: string;
  total: Prisma.Decimal;
  estimateBy: string;
  estimateDate: Date;
  approvalBy: string;
  approvalDate: Date;
  localApprovalBy: string;
  localApprovalDate: Date;
  completeBy: string;
  completeDate: Date;
  noteEstimate: string;
}

export interface RepairContRepositoryPort
  extends RepositoryPort<RepairContEntity> {
  findOne(params: RepairContFindOneParams): Promise<Option<RepairContEntity>>;
  findOneByContainerNo(containerNo: string): Promise<Option<RepairContEntity>>;
  findRepairContByIdRefInEstimate(
    params: RepairContFindByIdRefInEstimateParams,
  ): Promise<Option<RepairContEntity>>;
  QueryInfoContainer(
    params: QueryInfoContByContainerNoOrEstimateNoParams,
  ): Promise<QueryInfoContByContainerNoOrEstimateNoResult>;
  findRepairContsByContainerNos(
    params: RepairContsFindByContainerNosParams,
  ): Promise<RepairContEntity[]>;
  QueryContByContNos(params: ContNosParams): Promise<ContNosResult[]>;
}
