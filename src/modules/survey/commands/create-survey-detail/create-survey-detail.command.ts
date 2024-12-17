import { Command, CommandProps } from '@libs/ddd';

export class CreateSurveyDetailCommand extends Command {
  // Add more properties here
  readonly idSurvey: bigint;
  readonly surveyDate: Date;
  readonly surveyBy: string;
  readonly noteSurvey?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateSurveyDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
