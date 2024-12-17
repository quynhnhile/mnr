export interface InfoContProps {
  id?: bigint;
  createdBy: string;
  updatedBy?: string | null;
  containerNo: string;
  operationCode: string;
  ownerCode?: string;
  localSizeType: string;
  isoSizeType: string;
  contType: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  tareWeight?: number;
  maxGrossWeight?: number;
  net?: number;
  capacity?: number;
  lastTest?: string;
  typeTest?: string;
  note?: string;
}

export interface CreateInfoContProps {
  createdBy: string;
  containerNo: string;
  operationCode: string;
  ownerCode?: string;
  localSizeType: string;
  isoSizeType: string;
  contType: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  tareWeight?: number;
  maxGrossWeight?: number;
  net?: number;
  capacity?: number;
  lastTest?: string;
  typeTest?: string;
  note?: string;
}

export interface UpdateInfoContProps {
  updatedBy: string;
  containerNo?: string;
  operationCode?: string;
  ownerCode?: string;
  localSizeType?: string;
  isoSizeType?: string;
  contType?: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  tareWeight?: number;
  maxGrossWeight?: number;
  net?: number;
  capacity?: number;
  lastTest?: string;
  typeTest?: string;
  note?: string;
}

export enum ContType {
  DRY = 'DRY',
  REEFER = 'REEFER',
  TANK = 'TANK',
}
