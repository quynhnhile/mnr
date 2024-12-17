export interface CleanMethodProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  cleanMethodCode: string;
  cleanMethodName: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateCleanMethodProps {
  // Add properties here
  operationCode: string;
  cleanMethodCode: string;
  cleanMethodName: string;
  note?: string;
  createdBy: string;
}

export interface UpdateCleanMethodProps {
  // Add properties here
  operationCode?: string;
  cleanMethodCode?: string;
  cleanMethodName?: string;
  note?: string;
  updatedBy: string;
}
