export interface DamageLocalProps {
  id?: bigint;
  damLocalCode: string;
  damLocalNameEn: string;
  damLocalNameVi?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateDamageLocalProps {
  damLocalCode: string;
  damLocalNameEn: string;
  damLocalNameVi?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateDamageLocalProps {
  // Add properties here
  damLocalCode?: string | null;
  damLocalNameEn?: string | null;
  damLocalNameVi?: string | null;
  note?: string | null;
  updatedBy: string;
}
