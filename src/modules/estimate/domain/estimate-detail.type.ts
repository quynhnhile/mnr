import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { JobRepairCleanEntity } from '@src/modules/job-repair-clean/domain/job-repair-clean.entity';

export interface EstimateDetailProps {
  id?: bigint;
  // Add properties here
  idEstimate: bigint;
  estimateNo: string;
  compCode: string;
  locCode?: string | null;
  damCode?: string | null;
  repCode: string;
  length: number;
  width: number;
  square: number;
  quantity: number;
  unit?: string;
  hours?: number;
  cwo?: string;
  laborRate?: number;
  laborPrice?: number;
  matePrice?: number;
  total?: number;
  currency?: string;
  payerCode: string;
  symbolCode: string;
  rate: number;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  statusCode: string;
  localApprovalDate?: Date | null;
  localApprovalBy?: string | null;
  approvalDate?: Date | null;
  approvalBy?: string | null;
  reqActiveDate?: Date | null;
  reqActiveBy?: string | null;
  sendOprDate?: Date | null;
  sendOprBy?: string | null;
  cancelDate?: Date | null;
  cancelBy?: string | null;
  isOprCancel?: boolean | null;
  note?: string;
  createdBy: string;
  updatedBy?: string | null;

  // additional props
  jobRepairCleans: JobRepairCleanEntity[];
}

export interface CreateEstimateDetailProps {
  // Add properties here
  idEstimate: bigint;
  estimateNo: string;
  compCode: string;
  locCode?: string | null;
  damCode?: string | null;
  repCode: string;
  length: number;
  width: number;
  quantity: number;
  payerCode: string;
  symbolCode: string;
  rate: number;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  note?: string;
  createdBy: string;
}

export interface EstimateDetailToUpdateSurveyProps {
  // Add properties here
  idEstimate?: bigint;
  estimateNo?: string;
  compCode?: string;
  locCode?: string | null;
  damCode?: string | null;
  repCode?: string;
  length?: number;
  width?: number;
  quantity?: number;
  payerCode?: string;
  symbolCode?: string;
  rate?: number;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  note?: string;
  createdBy: string;

  id?: number;
}

export interface UpdateEstimateDetailProps {
  // Add properties here
  idEstimate?: bigint;
  estimateNo?: string;
  compCode?: string;
  locCode?: string;
  damCode?: string;
  repCode?: string;
  length?: number;
  width?: number;
  quantity?: number;
  payerCode?: string;
  symbolCode?: string;
  rate?: number;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  note?: string;
  updatedBy: string;
}

export interface CalculateEstimateDetailTariffProps {
  tariffGroup: TariffGroupEntity;
  tariff: TariffEntity;
}
