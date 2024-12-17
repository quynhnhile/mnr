import { Command, CommandProps } from '@libs/ddd';

export class UpdateSysConfigOprCommand extends Command {
  readonly sysConfigOprId: bigint;
  readonly operationCode?: string | null;
  readonly policyInfo?: string | null;
  readonly discountRate?: number | null;
  readonly amount?: number | null;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateSysConfigOprCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
