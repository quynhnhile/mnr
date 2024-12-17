import { Command, CommandProps } from '@libs/ddd';

export class RequestActiveEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  readonly reqActiveBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<RequestActiveEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
