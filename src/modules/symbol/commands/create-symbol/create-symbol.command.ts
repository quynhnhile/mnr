import { Command, CommandProps } from '@libs/ddd';

export class CreateSymbolCommand extends Command {
  readonly symbolCode: string;
  readonly symbolName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateSymbolCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
