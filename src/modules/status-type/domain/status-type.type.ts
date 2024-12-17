export interface StatusTypeProps {
  id?: bigint;
  statusTypeCode: string;
  statusTypeName: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateStatusTypeProps {
  statusTypeCode: string;
  statusTypeName: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateStatusTypeProps {
  statusTypeCode?: string;
  statusTypeName?: string;
  note?: string | null;
  updatedBy: string;
}
