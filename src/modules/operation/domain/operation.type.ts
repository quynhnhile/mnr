export interface OperationProps {
  id?: string;
  operationCode: string;
  operationName: string;
  isEdo: boolean;
  isLocalForeign: OperationType;
  isActive: boolean;
  moneyCredit?: string | null;
  policyInfo?: string | null;
  cleanMethodCode?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateOperationProps {
  operationCode: string;
  operationName: string;
  isEdo?: boolean;
  isLocalForeign?: OperationType;
  isActive: boolean;
  moneyCredit?: string;
  policyInfo?: string;
  cleanMethodCode?: string;
  createdBy: string;
}

export interface UpdateOperationProps {
  operationCode?: string;
  operationName?: string;
  isEdo?: boolean;
  isLocalForeign?: OperationType;
  isActive?: boolean;
  moneyCredit?: string;
  policyInfo?: string;
  cleanMethodCode?: string;
  updatedBy: string;
}

export enum OperationType {
  LOCAL = 'L',
  FOREIGN = 'F',
}
