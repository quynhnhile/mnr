export interface RepairContProps {
  id?: bigint;
  // Add properties here
  idCont: string;
  containerNo: string;
  operationCode: string;
  pinCode?: string | null;
  orderNo?: string | null;
  bookingNo?: string | null;
  blNo?: string | null;
  location?: string | null;
  localSizeType: string;
  isoSizeType: string;
  conditionCode?: string | null;
  classifyCode?: string | null;
  conditionMachineCode?: string | null;
  conditionCodeAfter?: string | null;
  conditionMachineCodeAfter?: string | null;
  factoryDate?: Date | null;
  statusCode: string;
  surveyInNo?: string | null;
  surveyOutNo?: string | null;
  estimateNo?: string | null;
  isComplete?: boolean | null;
  completeDate?: Date | null;
  completeBy?: string | null;
  billCheck?: boolean | null;
  billDate?: Date | null;
  billOprConfirm?: boolean | null;
  billOprReason?: string | null;
  isPosted?: boolean | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateRepairContProps {
  // Add properties here
  idCont: string;
  containerNo: string;
  operationCode: string;
  pinCode?: string | null;
  orderNo?: string | null;
  bookingNo?: string | null;
  blNo?: string | null;
  location?: string | null;
  localSizeType: string;
  isoSizeType: string;
  conditionCode?: string | null;
  classifyCode?: string | null;
  conditionMachineCode?: string | null;
  conditionCodeAfter?: string | null;
  conditionMachineCodeAfter?: string | null;
  factoryDate?: Date | null;
  statusCode: string;
  surveyInNo?: string | null;
  surveyOutNo?: string | null;
  estimateNo?: string | null;
  isComplete?: boolean | null;
  completeDate?: Date | null;
  completeBy?: string | null;
  billCheck?: boolean | null;
  billDate?: Date | null;
  billOprConfirm?: boolean | null;
  billOprReason?: string | null;
  isPosted?: boolean | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateRepairContProps {
  // Add properties here
  idCont?: string | null;
  containerNo?: string | null;
  operationCode?: string | null;
  pinCode?: string | null;
  orderNo?: string | null;
  bookingNo?: string | null;
  blNo?: string | null;
  location?: string | null;
  localSizeType?: string | null;
  isoSizeType?: string | null;
  conditionCode?: string | null;
  classifyCode?: string | null;
  conditionMachineCode?: string | null;
  conditionCodeAfter?: string | null;
  conditionMachineCodeAfter?: string | null;
  factoryDate?: Date | null;
  statusCode?: string | null;
  surveyInNo?: string | null;
  surveyOutNo?: string | null;
  estimateNo?: string | null;
  isComplete?: boolean | null;
  completeDate?: Date | null;
  completeBy?: string | null;
  billCheck?: boolean | null;
  billDate?: Date | null;
  billOprConfirm?: boolean | null;
  billOprReason?: string | null;
  isPosted?: boolean | null;
  note?: string | null;
  updatedBy: string;
}

export interface UpdateCompleteProps {
  isComplete?: boolean | null;
  completeDate?: Date | null;
  completeBy?: string | null;
}

export interface UpdateConditionAndClassifyProps {
  condtionCode?: string | null;
  classifyCode?: string | null;
}
