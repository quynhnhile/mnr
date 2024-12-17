import { Command, CommandProps } from '@libs/ddd';

export class SendOprerationEstimateCommand extends Command {
  readonly estimateId: bigint;
  readonly sendOprBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<SendOprerationEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
