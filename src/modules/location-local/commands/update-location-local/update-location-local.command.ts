import { Command, CommandProps } from '@libs/ddd';

export class UpdateLocationLocalCommand extends Command {
  readonly locationLocalId: bigint;
  readonly groupLocLocalCode?: string | null;
  readonly locLocalCode?: string | null;
  readonly locLocalNameEn?: string | null;
  readonly locLocalNameVi?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateLocationLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
