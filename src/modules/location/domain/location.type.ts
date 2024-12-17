export interface LocationProps {
  id?: bigint;
  locCode: string;
  locNameEn: string;
  locNameVi?: string | null;
  side?: string | null;
  size?: number | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  inUseCount?: number;
}

export interface CreateLocationProps {
  locCode: string;
  locNameEn: string;
  locNameVi?: string | null;
  side?: string | null;
  size?: number | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateLocationProps {
  locCode?: string | null;
  locNameEn?: string | null;
  locNameVi?: string | null;
  side?: string | null;
  size?: number | null;
  note?: string | null;
  updatedBy: string;
}
