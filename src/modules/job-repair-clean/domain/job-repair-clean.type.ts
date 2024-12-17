export interface JobRepairCleanProps {
  id?: bigint;
  // Add properties here
  idRef: bigint;
  idCont: string;
  containerNo: string;
  idEstItem?: bigint;
  estimateNo: string;
  idJob: string;
  seq: number;
  repCode: string;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  jobStatus: string;
  startDate?: Date | null;
  startBy?: string | null;
  finishDate?: Date | null;
  finishBy?: string | null;
  cancelDate?: Date | null;
  cancelBy?: string | null;
  completeDate?: Date | null;
  completeBy?: string | null;
  vendorCode?: string | null;
  isReclean: boolean;
  idRefReclean?: bigint | null;
  recleanReason?: string | null;
  kcsStatus: number;
  kcsNote?: string | null;
  note?: string | null;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateJobRepairCleanProps {
  // Add properties here
  idRef: bigint;
  idCont: string;
  containerNo: string;
  idEstItem: bigint;
  estimateNo: string;
  idJob: string;
  seq: number;
  repCode: string;
  isClean?: boolean;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  startBy?: string | null;
  startDate?: Date | null;
  jobStatus: string;
  vendorCode?: string | null;
  isReclean: boolean;
  idRefReclean?: bigint | null;
  recleanReason?: string | null;
  kcsStatus: number;
  kcsNote?: string | null;
  note?: string | null;

  createdBy: string;
}

export interface UpdateJobRepairCleanProps {
  // Add properties here
  idRef?: bigint | null;
  idCont?: string | null;
  containerNo?: string | null;
  idEstItem?: bigint | null;
  estimateNo?: string | null;
  idJob?: string | null;
  repCode?: string | null;
  isClean?: boolean | null;
  cleanMethodCode?: string | null;
  cleanModeCode?: string | null;
  jobStatus?: string;
  vendorCode?: string | null;
  isReclean?: boolean | null;
  idRefReclean?: bigint | null;
  recleanReason?: string | null;
  kcsStatus?: number | null;
  kcsNote?: string | null;
  note?: string | null;
  updatedBy: string;
}

export interface StartProps {
  startBy: string;
}

export interface FinishProps {
  finishBy?: string;
}

export interface CancelProps {
  cancelBy: string;
}

export interface CompleteProps {
  finishBy?: string;
  completeBy?: string;
}
