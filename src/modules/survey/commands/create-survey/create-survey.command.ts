import { Command, CommandProps } from '@libs/ddd';
import { CreateSurveyDetailProps } from '@modules/survey/domain/survey-detail.type';
import { SurveyInOut } from '@modules/survey/domain/survey.type';
import { CreateEstimateProps } from '@src/modules/estimate/domain/estimate.type';
import { CreateLocalDmgDetailProps } from '@src/modules/local-dmg-detail/domain/local-dmg-detail.type';

export class CreateSurveyCommand extends Command {
  // Add more properties here
  readonly containerNo: string;
  readonly operationCode: string;
  readonly eirNo?: string;
  readonly fe?: string;
  readonly isInOut: SurveyInOut;
  readonly surveyLocationCode: string;
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
  readonly surveyBy: string;
  readonly finishDate?: Date;
  readonly finishBy?: string;
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
  readonly createdBy: string;

  readonly surveyDetails?: CreateSurveyDetailProps[];
  readonly localDmgDetails?: CreateLocalDmgDetailProps[];
  readonly estimate?: CreateEstimateProps;

  constructor(props: CommandProps<CreateSurveyCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
