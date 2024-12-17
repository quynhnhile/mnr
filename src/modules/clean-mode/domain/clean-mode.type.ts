export interface CleanModeProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  cleanModeCode: string;
  cleanModeName: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateCleanModeProps {
  // Add properties here
  operationCode: string;
  cleanModeCode: string;
  cleanModeName: string;
  note?: string;
  createdBy: string;
}

export interface UpdateCleanModeProps {
  // Add properties here
  operationCode?: string;
  cleanModeCode?: string;
  cleanModeName?: string;
  note?: string;
  updatedBy: string;
}
