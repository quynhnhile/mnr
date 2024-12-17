import { Command, CommandProps } from '@libs/ddd';

export class CreateLocationLocalCommand extends Command {
  // Add more properties here
  readonly groupLocLocalCode: string;
  readonly locLocalCode: string;
  readonly locLocalNameEn: string;
  readonly locLocalNameVi?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateLocationLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
