export interface RepairProps {
  id?: bigint;
  // Add properties here
  operationCode: string;
  repCode: string;
  repNameEn: string;
  repNameVi?: string | null;
  isClean: boolean;
  isRepair: boolean;
  isPti: boolean;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateRepairProps {
  // Add properties here
  operationCode: string;
  repCode: string;
  repNameEn: string;
  repNameVi?: string | null;
  isClean: boolean;
  isRepair: boolean;
  isPti: boolean;
  note?: string | null;
  createdBy: string;
}

export interface UpdateRepairProps {
  // Add properties here
  operationCode?: string | null;
  repCode?: string | null;
  repNameEn?: string | null;
  repNameVi?: string | null;
  isClean?: boolean | null;
  isRepair?: boolean | null;
  isPti?: boolean | null;
  note?: string | null;
  updatedBy: string;
}
