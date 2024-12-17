import { Command, CommandProps } from '@libs/ddd';

export class CreatePayerCommand extends Command {
  readonly payerCode: string;
  readonly payerName: string;
  readonly mappingTos: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreatePayerCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
