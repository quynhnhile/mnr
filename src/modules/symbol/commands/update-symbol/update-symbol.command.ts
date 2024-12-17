import { Command, CommandProps } from '@libs/ddd';

export class UpdateSymbolCommand extends Command {
  readonly symbolId: bigint;
  readonly symbolCode?: string;
  readonly symbolName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateSymbolCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
