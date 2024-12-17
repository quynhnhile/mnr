import { Command, CommandProps } from '@libs/ddd';

export class CreateStatusTypeCommand extends Command {
  readonly statusTypeCode: string;
  readonly statusTypeName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateStatusTypeCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
