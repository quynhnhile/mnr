import { Command, CommandProps } from '@libs/ddd';

export class CreateDamageLocalCommand extends Command {
  readonly damLocalCode: string;
  readonly damLocalNameEn: string;
  readonly damLocalNameVi?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateDamageLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
