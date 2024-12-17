import { Command, CommandProps } from '@libs/ddd';

export class UpdateEstimateCommand extends Command {
  readonly estimateId: bigint;
  // Add more properties here
  readonly altEstimateNo?: string | null;
  readonly noteEstimate?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
