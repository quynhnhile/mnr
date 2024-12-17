import { Command, CommandProps } from '@libs/ddd';

export class UpdateSurveyDetailCommand extends Command {
  readonly surveyDetailId: bigint;
  // Add more properties here
  readonly idSurvey?: bigint;
  readonly idCont?: string;
  readonly containerNo?: string;
  readonly surveyNo?: string;
  readonly surveyDate?: Date;
  readonly surveyBy?: string;
  readonly noteSurvey?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateSurveyDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
