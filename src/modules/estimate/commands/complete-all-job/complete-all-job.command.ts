import { Command, CommandProps } from '@libs/ddd';

export class CompleteAllJobCommand extends Command {
  readonly estimateId: bigint;
  readonly isClean: boolean;
  readonly completeBy?: string;

  constructor(props: CommandProps<CompleteAllJobCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
