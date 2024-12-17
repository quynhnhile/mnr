import { Command, CommandProps } from '@libs/ddd';

export class CreateLocalDmgDetailCommand extends Command {
  // Add more properties here
  readonly idSurvey: bigint;
  readonly damLocalCode: string;
  readonly locLocalCode: string;
  readonly symbolCode: string;
  readonly size: string;
  readonly damDesc?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateLocalDmgDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
