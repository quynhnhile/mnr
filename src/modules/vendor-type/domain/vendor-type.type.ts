export interface VendorTypeProps {
  id?: bigint;
  vendorTypeCode: string;
  vendorTypeName: string;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  inUseCount?: number;
}

export interface CreateVendorTypeProps {
  vendorTypeCode: string;
  vendorTypeName: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateVendorTypeProps {
  vendorTypeCode?: string;
  vendorTypeName?: string;
  note?: string | null;
  updatedBy: string;
}
