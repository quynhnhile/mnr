import { Command, CommandProps } from '@libs/ddd';

export class CreateComDamRepCommand extends Command {
  // Add more properties here
  readonly compCode: string;
  readonly damCode: string;
  readonly repCode: string;
  readonly nameEn: string;
  readonly nameVi?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateComDamRepCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
