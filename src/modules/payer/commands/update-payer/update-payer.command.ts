import { Command, CommandProps } from '@libs/ddd';

export class UpdatePayerCommand extends Command {
  readonly payerId: bigint;
  readonly payerCode?: string;
  readonly payerName?: string;
  readonly mappingTos?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdatePayerCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
