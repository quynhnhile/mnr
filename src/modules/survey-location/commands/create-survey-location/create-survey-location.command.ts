import { Command, CommandProps } from '@libs/ddd';

export class CreateSurveyLocationCommand extends Command {
  // Add more properties here
  readonly surveyLocationCode: string;
  readonly surveyLocationName: string;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateSurveyLocationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
