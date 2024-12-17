export interface SymbolProps {
  id?: bigint;
  symbolCode: string;
  symbolName: string;
  note?: string;

  createdBy: string;
  updatedBy?: string | null;
  inUseCount?: number;
}

export interface CreateSymbolProps {
  symbolCode: string;
  symbolName: string;
  note?: string;

  createdBy: string;
}

export interface UpdateSymbolProps {
  symbolCode?: string;
  symbolName?: string;
  note?: string;
  updatedBy: string;
}
