export interface PayerProps {
  id?: bigint;
  payerCode: string;
  payerName: string;
  mappingTos: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreatePayerProps {
  payerCode: string;
  payerName: string;
  mappingTos: string;
  note?: string;
  createdBy: string;
}

export interface UpdatePayerProps {
  payerCode?: string;
  payerName?: string;
  mappingTos?: string;
  note?: string;
  updatedBy: string;
}
