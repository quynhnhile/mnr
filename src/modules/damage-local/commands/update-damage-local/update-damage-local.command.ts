import { Command, CommandProps } from '@libs/ddd';

export class UpdateDamageLocalCommand extends Command {
  readonly damageLocalId: bigint;
  readonly damLocalCode?: string | null;
  readonly damLocalNameEn?: string | null;
  readonly damLocalNameVi?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateDamageLocalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
