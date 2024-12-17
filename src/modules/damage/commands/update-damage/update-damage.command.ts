import { Command, CommandProps } from '@libs/ddd';

export class UpdateDamageCommand extends Command {
  readonly damageId: bigint;

  readonly operationCode?: string;
  readonly damCode?: string;
  readonly damNameEn?: string;
  readonly damNameVi?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateDamageCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
