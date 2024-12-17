import { Prisma } from '@prisma/client';

export interface ManageRepairContainerParams {
  statusCode?: string;
  fromDate?: Date;
  toDate?: Date;
  operationCode?: string;
  isRevice?: boolean;
}

export interface ManageRepairContainerResult {
  containerNo: string;
  dateIn: Date;
  isRevice: boolean;
  approvalDate: Date;
  approvalBy: string;
  completeDate: Date;
  completeBy: string;
  estimateBy: string;
  estimateDate: Date;
  noteSurvey: string;
  noteEstimate: string;
  localSizeType: string;
  conditionCode: string;
  operationCode: string;
  estimateNo: string;
  total: Prisma.Decimal;
  yardCode: string;
}

export interface ManageRepairContainerPort {
  manageRepairContainer(
    params: ManageRepairContainerParams,
  ): Promise<ManageRepairContainerResult[]>;
}
