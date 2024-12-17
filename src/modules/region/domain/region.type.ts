export interface RegionProps {
  id?: bigint;
  regionCode: string;
  regionName: string;
  note?: string | null;
  sort?: number | null;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateRegionProps {
  regionCode: string;
  regionName: string;
  note?: string;
  sort?: number;
  createdBy: string;
}

export interface UpdateRegionProps {
  regionCode?: string;
  regionName?: string;
  note?: string;
  sort?: number;
  updatedBy: string;
}
