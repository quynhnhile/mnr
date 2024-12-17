import { Command, CommandProps } from '@libs/ddd';

export class CreateLocationCommand extends Command {
  readonly locCode: string;
  readonly locNameEn: string;
  readonly locNameVi?: string;
  readonly side?: string;
  readonly size?: number;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateLocationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
