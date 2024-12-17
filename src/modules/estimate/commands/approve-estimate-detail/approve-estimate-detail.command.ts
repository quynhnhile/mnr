import { Command, CommandProps } from '@libs/ddd';

export class AprroveEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  readonly approvalBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<AprroveEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
