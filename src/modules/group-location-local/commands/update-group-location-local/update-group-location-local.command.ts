import { Command, CommandProps } from '@libs/ddd';

export class UpdateGroupLocationLocalCommand extends Command {
  readonly groupLocationLocalId: bigint;
  readonly groupLocLocalCode?: string | null;
  readonly groupLocLocalName?: string | null;
  readonly contType?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateGroupLocationLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
