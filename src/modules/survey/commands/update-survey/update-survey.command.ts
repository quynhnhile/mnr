import { Command, CommandProps } from '@libs/ddd';
import { SurveyInOut } from '@modules/survey/domain/survey.type';
import { EstimateToUpdateSurveyProps } from '@src/modules/estimate/domain/estimate.type';
import { LocalDmgDetailToUpdateSurveyProps } from '@src/modules/local-dmg-detail/domain/local-dmg-detail.type';

export class UpdateSurveyCommand extends Command {
  readonly surveyId: bigint;
  // Add more properties here
  readonly fe?: string;
  readonly isInOut?: SurveyInOut;
  readonly surveyLocationCode?: string;
  readonly conditionCode?: string;
  readonly conditionMachineCode?: string;
  readonly classifyCode?: string;
  readonly cleanMethodCode?: string;
  readonly cleanModeCode?: string;
  readonly deposit?: number;
  readonly vendorCode?: string;
  readonly idCheck?: bigint;
  readonly checkNo?: string;
  readonly isTankOutside?: boolean;
  readonly isTankInside?: boolean;
  readonly isTest1bar?: boolean;
  readonly preSurveyNo?: string;
  readonly surveyDate?: Date;
  readonly surveyBy?: string;
  readonly isRemoveMark?: boolean;
  readonly removeMark?: number;
  readonly isRevice?: boolean;
  readonly altSurveyNo?: string;
  readonly noteSurvey?: string;
  readonly noteCont?: string;
  readonly noteDam?: string;
  readonly noteSpecialHandling?: string;
  readonly noteEir?: string;
  readonly noteMachine?: string;
  readonly note?: string;
  readonly isException?: boolean;
  readonly pti?: boolean;
  readonly updatedBy: string;

  readonly estimate?: EstimateToUpdateSurveyProps;
  readonly localDmgDetails?: LocalDmgDetailToUpdateSurveyProps[];

  constructor(props: CommandProps<UpdateSurveyCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
