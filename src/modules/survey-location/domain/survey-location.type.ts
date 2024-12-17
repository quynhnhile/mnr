export interface SurveyLocationProps {
  id?: bigint;
  // Add properties here
  surveyLocationCode: string;
  surveyLocationName: string;
  note?: string | null;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateSurveyLocationProps {
  // Add properties here
  surveyLocationCode: string;
  surveyLocationName: string;
  note?: string | null;
  createdBy: string;
}

export interface UpdateSurveyLocationProps {
  // Add properties here
  surveyLocationCode?: string;
  surveyLocationName?: string;
  note?: string;
  updatedBy: string;
}
