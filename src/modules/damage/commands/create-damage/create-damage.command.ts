import { Command, CommandProps } from '@libs/ddd';

export class CreateDamageCommand extends Command {
  readonly operationCode?: string;
  readonly damCode: string;
  readonly damNameEn: string;
  readonly damNameVi?: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateDamageCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
