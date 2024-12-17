import { Command, CommandProps } from '@libs/ddd';

export class CancelEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  readonly cancelBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<CancelEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
