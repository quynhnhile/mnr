import { Prisma } from '@prisma/client';

export interface CleaningAndRepairParams {
  statusCode?: string;
  fromDate?: Date;
  toDate?: Date;
  operationCode?: string;
  localSizeType?: string;
  conditionCode?: string;
  contType?: string;
  payerCode: string[];
}

export interface CleaningAndRepairResult {
  containerNo: string;
  dateIn: Date;
  estimateDate: Date;
  estimateBy: string;
  localApprovalDate: Date;
  localApprovalBy: string;
  approvalDate: Date;
  approvalBy: string;
  completeDate: Date;
  completeBy: string;
  localSizeType: string;
  operationCode: string;
  estimateNo: string;
  isClean: boolean;
  hours: Prisma.Decimal;
  total: Prisma.Decimal;
  payerCode: string;
  yardCode: string;
}

export interface ReportCleaningAndRepairPort {
  reportCleanAndRepair(
    params: CleaningAndRepairParams,
  ): Promise<CleaningAndRepairResult[]>;
}
