export interface TariffGroupProps {
  id?: bigint;
  groupTrfCode: string;
  groupTrfName: string;
  laborRate: number;
  isDry: boolean;
  isReefer: boolean;
  isTank: boolean;
  operationCode?: string[] | null;
  vendorCode?: string | null;
  isTerminal?: boolean | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateTariffGroupProps {
  // Add properties here
  groupTrfCode: string;
  groupTrfName: string;
  laborRate: number;
  isDry: boolean;
  isReefer: boolean;
  isTank: boolean;
  operationCode?: string[] | null;
  vendorCode?: string | null;
  isTerminal?: boolean | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateTariffGroupProps {
  // Add properties here
  groupTrfCode?: string | null;
  groupTrfName?: string | null;
  laborRate?: number | null;
  isDry?: boolean | null;
  isReefer?: boolean | null;
  isTank?: boolean | null;
  operationCode?: string[] | null;
  vendorCode?: string | null;
  isTerminal?: boolean | null;
  note?: string | null;
  updatedBy: string;
}
