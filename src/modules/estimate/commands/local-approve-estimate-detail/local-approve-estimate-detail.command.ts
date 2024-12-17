import { Command, CommandProps } from '@libs/ddd';

export class LocalAprroveEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  readonly localApprovalBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<LocalAprroveEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
