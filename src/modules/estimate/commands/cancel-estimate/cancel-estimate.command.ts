import { Command, CommandProps } from '@libs/ddd';

export class CancelEstimateCommand extends Command {
  readonly estimateId: bigint;
  readonly cancelBy: string;
  readonly isOprCancel?: boolean;
  readonly updatedBy: string;

  constructor(props: CommandProps<CancelEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
