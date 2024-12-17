import { Command, CommandProps } from '@libs/ddd';

export class UpdateStatusTypeCommand extends Command {
  readonly statusTypeId: bigint;
  readonly statusTypeCode?: string;
  readonly statusTypeName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateStatusTypeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
