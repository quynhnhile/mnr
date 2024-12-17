import { Command, CommandProps } from '@libs/ddd';

export class RequestActiveEstimateCommand extends Command {
  readonly estimateId: bigint;
  readonly reqActiveBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<RequestActiveEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
