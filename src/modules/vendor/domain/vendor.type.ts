export interface VendorProps {
  id?: string;
  operationCode?: string | null;
  vendorTypeCode: string;
  vendorCode: string;
  vendorName: string;
  isActive?: boolean;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateVendorProps {
  operationCode?: string;
  vendorTypeCode: string;
  vendorCode: string;
  vendorName: string;
  isActive?: boolean;
  note?: string;
  createdBy: string;
}

export interface UpdateVendorProps {
  operationCode?: string;
  vendorTypeCode?: string;
  vendorCode?: string;
  vendorName?: string;
  isActive?: boolean;
  note?: string;
  updatedBy: string;
}
