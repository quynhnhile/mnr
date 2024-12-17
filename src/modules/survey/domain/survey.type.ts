import { SurveyDetailEntity } from './survey-detail.entity';
import { CreateSurveyDetailProps } from './survey-detail.type';

export interface SurveyProps {
  id?: bigint;
  // Add properties here
  idRep: bigint;
  idCont: string;
  containerNo: string;
  surveyNo: string;
  eirNo?: string;
  fe?: string;
  isInOut: SurveyInOut;
  surveyLocationCode: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  conditionCode?: string;
  conditionMachineCode?: string;
  classifyCode?: string;
  cleanMethodCode?: string;
  cleanModeCode?: string;
  deposit?: number;
  vendorCode?: string;
  idCheck?: bigint;
  checkNo?: string;
  isTankOutside?: boolean;
  isTankInside?: boolean;
  isTest1bar?: boolean;
  preSurveyNo?: string;
  surveyDate: Date;
  surveyBy: string;
  finishDate?: Date;
  finishBy?: string;
  isRemoveMark?: boolean;
  removeMark?: number;
  isRevice?: boolean;
  altSurveyNo?: string;
  noteSurvey?: string;
  noteCont?: string;
  noteDam?: string;
  noteSpecialHandling?: string;
  noteEir?: string;
  noteMachine?: string;
  note?: string;
  isException?: boolean;
  pti?: boolean;

  createdBy: string;
  updatedBy?: string | null;

  // additional properties
  surveyDetails: SurveyDetailEntity[];
}

export interface CreateSurveyProps {
  // Add properties here
  idRep: bigint;
  idCont: string;
  containerNo: string;
  surveyNo: string;
  eirNo?: string;
  fe?: string;
  isInOut: SurveyInOut;
  surveyLocationCode: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  conditionCode?: string;
  conditionMachineCode?: string;
  classifyCode?: string;
  cleanMethodCode?: string;
  cleanModeCode?: string;
  deposit?: number;
  vendorCode?: string;
  idCheck?: bigint;
  checkNo?: string;
  isTankOutside?: boolean;
  isTankInside?: boolean;
  isTest1bar?: boolean;
  preSurveyNo?: string;
  surveyDate: Date;
  surveyBy: string;
  isRemoveMark?: boolean;
  removeMark?: number;
  isRevice?: boolean;
  altSurveyNo?: string;
  noteSurvey?: string;
  noteCont?: string;
  noteDam?: string;
  noteSpecialHandling?: string;
  noteEir?: string;
  noteMachine?: string;
  note?: string;
  isException?: boolean;
  pti?: boolean;
  createdBy: string;

  // additional properties
  surveyDetails: CreateSurveyDetailProps[];
}

export interface UpdateSurveyProps {
  // Add properties here
  idRep?: bigint;
  fe?: string;
  isInOut?: SurveyInOut;
  surveyLocationCode?: string;
  contAge?: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  conditionCode?: string;
  conditionMachineCode?: string;
  classifyCode?: string;
  cleanMethodCode?: string;
  cleanModeCode?: string;
  deposit?: number;
  vendorCode?: string;
  idCheck?: bigint;
  checkNo?: string;
  isTankOutside?: boolean;
  isTankInside?: boolean;
  isTest1bar?: boolean;
  preSurveyNo?: string;
  surveyDate?: Date;
  surveyBy?: string;
  isRemoveMark?: boolean;
  removeMark?: number;
  isRevice?: boolean;
  altSurveyNo?: string;
  noteSurvey?: string;
  noteCont?: string;
  noteDam?: string;
  noteSpecialHandling?: string;
  noteEir?: string;
  noteMachine?: string;
  note?: string;
  isException?: boolean;
  pti?: boolean;
  updatedBy: string;
}

export enum SurveyInOut {
  IN = 'I',
  OUT = 'O',
}

export interface FinishSurveyProps {
  finishBy: string;
  machineAge?: string;
  machineBrand?: string;
  machineModel?: string;
  conditionMachineCode?: string;
  pti?: boolean;
  noteMachine?: string;
}
