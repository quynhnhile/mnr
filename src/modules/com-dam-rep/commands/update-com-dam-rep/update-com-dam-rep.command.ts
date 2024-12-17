import { Command, CommandProps } from '@libs/ddd';

export class UpdateComDamRepCommand extends Command {
  readonly comDamRepId: bigint;
  // Add more properties here
  readonly compCode?: string | null;
  readonly damCode?: string | null;
  readonly repCode?: string | null;
  readonly nameEn?: string | null;
  readonly nameVi?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateComDamRepCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
