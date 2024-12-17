import { Command, CommandProps } from '@libs/ddd';

export class SendOprEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  readonly sendOprBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<SendOprEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
