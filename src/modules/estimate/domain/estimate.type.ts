import { EstimateDetailEntity } from './estimate-detail.entity';
import {
  CreateEstimateDetailProps,
  EstimateDetailToUpdateSurveyProps,
} from './estimate-detail.type';

export interface EstimateProps {
  id?: bigint;
  // Add properties here
  idRef: bigint;
  idCont: string;
  containerNo: string;
  estimateNo: string;
  estimateBy?: string | null;
  estimateDate?: Date | null;
  statusCode: string;
  localApprovalBy?: string | null;
  localApprovalDate?: Date | null;
  sendOprBy?: string | null;
  sendOprDate?: Date | null;
  approvalBy?: string | null;
  approvalDate?: Date | null;
  cancelBy?: string | null;
  cancelDate?: Date | null;
  isOprCancel?: boolean | null;
  reqActiveBy?: string | null;
  reqActiveDate?: Date | null;
  altEstimateNo?: string | null;
  noteEstimate?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional props
  estimateDetails: EstimateDetailEntity[];
  totalEstimateValue?: number;
  estimateDetailCount?: number;
  localApprovalEstimateCount?: number;
  operationApprovalEstimateCount?: number;
  operationRejectedEstimateCount?: number;
  rejectedEstimateCount?: number;
}

export interface CreateEstimateProps {
  // Add properties here
  idRef: bigint;
  idCont: string;
  containerNo: string;
  estimateNo: string;
  estimateBy?: string | null;
  estimateDate?: Date | null;
  statusCode: string;
  localApprovalBy?: string | null;
  localApprovalDate?: Date | null;
  sendOprBy?: string | null;
  sendOprDate?: Date | null;
  approvalBy?: string | null;
  approvalDate?: Date | null;
  cancelBy?: string | null;
  cancelDate?: Date | null;
  isOprCancel?: boolean | null;
  reqActiveBy?: string | null;
  reqActiveDate?: Date | null;
  altEstimateNo?: string | null;
  noteEstimate?: string | null;
  note?: string | null;
  createdBy: string;

  // additional props
  estimateDetails: CreateEstimateDetailProps[];
}

export interface EstimateToUpdateSurveyProps {
  // Add properties here
  id: number;

  // additional props
  estimateDetails: EstimateDetailToUpdateSurveyProps[];
}

export interface UpdateEstimateProps {
  // Add properties here
  idRef?: bigint | null;
  idCont?: string | null;
  containerNo?: string | null;
  estimateNo?: string | null;
  estimateBy?: string | null;
  estimateDate?: Date | null;
  statusCode?: string | null;
  localApprovalBy?: string | null;
  localApprovalDate?: Date | null;
  sendOprBy?: string | null;
  sendOprDate?: Date | null;
  approvalBy?: string | null;
  approvalDate?: Date | null;
  cancelBy?: string | null;
  cancelDate?: Date | null;
  isOprCancel?: boolean | null;
  reqActiveBy?: string | null;
  reqActiveDate?: Date | null;
  altEstimateNo?: string | null;
  noteEstimate?: string | null;
  note?: string | null;
  updatedBy: string;
}

export interface LocalApproveEstimateProps {
  localApprovalBy: string;
}

export interface SendOperationProps {
  sendOprBy: string;
}

export interface ApproveEstimateProps {
  approvalBy: string;
}

export interface CancelEstimateProps {
  cancelBy: string;
  isOprCancel?: boolean | null;
}

export interface RequestActiveEstimateProps {
  reqActiveBy: string;
}

export enum EstimateStatus {
  INSPECTION = 'I', // chờ giám định
  SURVEY = 'S', // đã giám định
  ESTIMATE = 'E', // đã báo giá
  LOCAL = 'L', // duyệt báo giá từ SNP
  WAITING = 'W', // đã gửi báo giá cho hãngtàu, chờ duyệt báo giá
  APPROVAL = 'A', // đã approval
  FACTORY = 'F', // đã chuyển vào khu vực sửa chữa
  REPAIR = 'R', // đang thực hiện sửa chữa/vệ sinh/PTI
  COMPLETE = 'C', // đã hoàn thành sửa chữa/vệ sinh/PTI
  CANCEL = 'X', // reject/không sửa chữa
}

export enum EstimateItemStatus {
  APPROVAL = 'A', // đã approval
  REPAIR_CLEAN_PTI = 'R', // đang thực hiện/sửa chữa/vệ sinh/PTI
  COMPLETE = 'C', // đã hoàn thành sửa chữa/vệ sinh/PTI
  CANCEL = 'X', // reject/không sửa chữa
  REVICE = 'J', // giám định lại
}
