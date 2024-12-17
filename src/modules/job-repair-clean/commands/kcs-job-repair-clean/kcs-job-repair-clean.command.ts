import { Command, CommandProps } from '@libs/ddd';

export class KcsJobRepairCleanCommand extends Command {
  readonly jobRepairCleanId: bigint;
  readonly kcsStatus?: number;
  readonly kcsNote?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<KcsJobRepairCleanCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
