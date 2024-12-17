export interface SurveyDetailProps {
  id?: bigint;
  // Add properties here
  idSurvey: bigint;
  idCont: string;
  containerNo: string;
  surveyNo: string;
  surveyDate: Date;
  surveyBy: string;
  noteSurvey?: string | null;
  note?: string | null;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateSurveyDetailProps {
  // Add properties here
  idSurvey?: bigint;
  idCont?: string;
  containerNo: string;
  surveyNo: string;
  surveyDate?: Date | null;
  surveyBy: string;
  noteSurvey?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateSurveyDetailProps {
  // Add properties here
  idSurvey?: bigint;
  idCont?: string;
  containerNo?: string;
  surveyNo?: string;
  surveyDate?: Date;
  surveyBy?: string;
  noteSurvey?: string | null;
  note?: string | null;
  updatedBy: string;
}
