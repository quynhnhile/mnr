export interface ConditionReeferProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  conditionCode: string;
  conditionMachineCode: string;
  isDamage: boolean;
  mappingCode: string;
  note?: string | null;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateConditionReeferProps {
  // Add properties here
  operationCode: string;
  conditionCode: string;
  conditionMachineCode: string;
  isDamage: boolean;
  mappingCode: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateConditionReeferProps {
  // Add properties here
  operationCode?: string | null;
  conditionCode?: string | null;
  conditionMachineCode?: string | null;
  isDamage?: boolean | null;
  mappingCode?: string | null;
  note?: string | null;
  updatedBy: string;
}
