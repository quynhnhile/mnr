export interface ComDamRepProps {
  id?: bigint;
  // Add properties here
  compCode: string;
  damCode: string;
  repCode: string;
  nameEn: string;
  nameVi?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateComDamRepProps {
  // Add properties here
  compCode: string;
  damCode: string;
  repCode: string;
  nameEn: string;
  nameVi?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateComDamRepProps {
  // Add properties here
  compCode?: string | null;
  damCode?: string | null;
  repCode?: string | null;
  nameEn?: string | null;
  nameVi?: string | null;
  note?: string | null;
  updatedBy: string;
}
