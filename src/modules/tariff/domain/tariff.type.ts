export interface TariffProps {
  id?: bigint;
  // Add properties here
  groupTrfCode: string;
  compCode: string;
  locCode?: string[] | null;
  damCode?: string | null;
  repCode: string;
  length: number;
  width: number;
  square: number;
  unit: string;
  quantity: number;
  hours: number;
  currency: string;
  mateAmount: number;
  totalAmount: number;
  vat?: number | null;
  includeVat: boolean;
  add?: number | null;
  addHours?: number | null;
  addMate?: number | null;
  note?: string | null;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateTariffProps {
  // Add properties here
  groupTrfCode: string;
  compCode: string;
  locCode?: string[] | null;
  damCode: string | null;
  repCode: string;
  length: number;
  width: number;
  unit: string;
  quantity: number;
  hours: number;
  currency: string;
  mateAmount: number;
  totalAmount: number;
  vat?: number | null;
  includeVat: boolean;
  add?: number | null;
  addHours?: number | null;
  addMate?: number | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateTariffProps {
  // Add properties here
  groupTrfCode?: string | null;
  compCode?: string | null;
  locCode?: string[] | null;
  damCode?: string | null;
  repCode?: string | null;
  length?: number | null;
  width?: number | null;
  unit?: string | null;
  quantity?: number | null;
  hours?: number | null;
  currency?: string | null;
  mateAmount?: number | null;
  totalAmount?: number | null;
  vat?: number | null | null;
  includeVat?: boolean | null;
  add?: number | null;
  addHours?: number | null;
  addMate?: number | null;
  note?: string | null;
  updatedBy: string;
}

export enum TariffUnit {
  Q = 'Q',
  S = 'S',
  L = 'L',
}
