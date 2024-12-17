import { Command, CommandProps } from '@libs/ddd';

export class UpdateSurveyLocationCommand extends Command {
  readonly surveyLocationId: bigint;
  // Add more properties here
  readonly surveyLocationCode?: string;
  readonly surveyLocationName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateSurveyLocationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
