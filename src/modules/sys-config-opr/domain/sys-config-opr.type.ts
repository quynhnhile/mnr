export interface SysConfigOprProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  policyInfo?: string | null;
  discountRate?: number | null;
  amount?: number | null;
  note?: string;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateSysConfigOprProps {
  // Add properties here
  operationCode: string;
  policyInfo?: string | null;
  discountRate?: number | null;
  amount?: number | null;
  note?: string;
  createdBy: string;
}

export interface UpdateSysConfigOprProps {
  // Add properties here
  operationCode?: string | null;
  policyInfo?: string | null;
  discountRate?: number | null;
  amount?: number | null;
  note?: string | null;
  updatedBy: string;
}
