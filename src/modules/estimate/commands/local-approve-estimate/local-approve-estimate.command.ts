import { Command, CommandProps } from '@libs/ddd';

export class LocalAprroveCommand extends Command {
  readonly estimateId: bigint;
  readonly localApprovalBy: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<LocalAprroveCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
