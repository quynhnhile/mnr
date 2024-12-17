export interface LocationLocalProps {
  id?: bigint;
  // Add properties here
  groupLocLocalCode: string;
  locLocalCode: string;
  locLocalNameEn: string;
  locLocalNameVi?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateLocationLocalProps {
  // Add properties here
  groupLocLocalCode: string;
  locLocalCode: string;
  locLocalNameEn: string;
  locLocalNameVi?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateLocationLocalProps {
  // Add properties here
  groupLocLocalCode?: string | null;
  locLocalCode?: string | null;
  locLocalNameEn?: string | null;
  locLocalNameVi?: string | null;
  note?: string | null;
  updatedBy: string;
}
