import { Command, CommandProps } from '@libs/ddd';

export class AprroveEstimateCommand extends Command {
  readonly estimateId: bigint;
  readonly approvalBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<AprroveEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
