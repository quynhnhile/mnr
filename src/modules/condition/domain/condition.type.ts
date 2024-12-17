export interface ConditionProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  conditionCode: string;
  conditionName: string;
  isDamage: boolean;
  isMachine: boolean;
  mappingCode?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateConditionProps {
  // Add properties here
  operationCode: string;
  conditionCode: string;
  conditionName: string;
  isDamage: boolean;
  isMachine: boolean;
  mappingCode?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateConditionProps {
  // Add properties here
  operationCode?: string | null;
  conditionCode?: string | null;
  conditionName?: string | null;
  isDamage?: boolean | null;
  isMachine?: boolean | null;
  mappingCode?: string | null;
  note?: string | null;
  updatedBy: string | null;
}
