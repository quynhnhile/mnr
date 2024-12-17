export interface ComponentProps {
  id?: bigint;
  // Add properties here
  operationCode?: string | null;
  compCode: string;
  compNameEn: string;
  compNameVi?: string | null;
  assembly?: string | null;
  side?: string | null;
  contType?: string | null;
  materialCode?: string | null;
  isMachine?: boolean | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateComponentProps {
  // Add properties here
  operationCode?: string | null;
  compCode: string;
  compNameEn: string;
  compNameVi?: string | null;
  assembly?: string | null;
  side?: string | null;
  contType?: string | null;
  materialCode?: string | null;
  isMachine?: boolean | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateComponentProps {
  // Add properties here
  operationCode?: string | null;
  compCode?: string | null;
  compNameEn?: string | null;
  compNameVi?: string | null;
  assembly?: string | null;
  side?: string | null;
  contType?: string | null;
  materialCode?: string | null;
  isMachine?: boolean | null;
  note?: string | null;
  updatedBy: string;
}
