export interface LocalDmgDetailProps {
  id?: bigint;
  // Add properties here
  idSurvey: bigint;
  idCont: string;
  damLocalCode: string;
  locLocalCode: string;
  symbolCode: string;
  size: string;
  damDesc?: string | null;
  note?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateLocalDmgDetailProps {
  // Add properties here
  idSurvey: bigint;
  idCont: string;
  damLocalCode: string;
  locLocalCode: string;
  symbolCode: string;
  size: string;
  damDesc?: string | null;
  note?: string | null;
  createdBy: string;
}

export interface UpdateLocalDmgDetailProps {
  // Add properties here
  idSurvey?: bigint | null;
  idCont?: string | null;
  damLocalCode?: string | null;
  locLocalCode?: string | null;
  symbolCode?: string | null;
  size?: string | null;
  damDesc?: string | null;
  note?: string | null;
  updatedBy: string;
}

export interface LocalDmgDetailToUpdateSurveyProps {
  // Add properties here
  idSurvey?: bigint;
  idCont?: string;
  damLocalCode?: string;
  locLocalCode?: string;
  symbolCode?: string;
  size?: string;
  damDesc?: string;
  note?: string;
  updatedBy: string;

  id?: number;
}
