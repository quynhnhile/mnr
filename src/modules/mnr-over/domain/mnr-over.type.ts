export interface MnrOverProps {
  id?: bigint;
  statusTypeCode: string;
  contType: string;
  jobModeCode: string;
  methodCode: string;
  startDate: string;
  endDate: string;
  pti?: string | null;
  from: number;
  to: number;
  unit: string;
  quantity: number;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateMnrOverProps {
  statusTypeCode: string;
  contType: string;
  jobModeCode: string;
  methodCode: string;
  startDate: string;
  endDate: string;
  pti?: string | null;
  from: number;
  to: number;
  unit: string;
  quantity: number;
  note?: string | null;
  createdBy: string;
}

export interface UpdateMnrOverProps {
  // Add properties here

  updatedBy: string;
}
