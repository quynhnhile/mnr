import { Command, CommandProps } from '@libs/ddd';

export class CreateGroupLocationLocalCommand extends Command {
  // Add more properties here
  readonly groupLocLocalCode: string;
  readonly groupLocLocalName: string;
  readonly contType: string;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateGroupLocationLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
