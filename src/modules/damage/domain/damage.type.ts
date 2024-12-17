export interface DamageProps {
  id?: bigint;
  // Add properties here
  operationCode?: string | null;
  damCode: string;
  damNameEn: string;
  damNameVi?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateDamageProps {
  // Add properties here
  operationCode?: string | null;
  damCode: string;
  damNameEn: string;
  damNameVi?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateDamageProps {
  // Add properties here
  operationCode?: string | null;
  damCode?: string | null;
  damNameEn?: string | null;
  damNameVi?: string | null;
  note?: string | null;
  updatedBy: string;
}
