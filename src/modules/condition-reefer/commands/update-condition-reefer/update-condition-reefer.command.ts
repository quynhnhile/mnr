import { Command, CommandProps } from '@libs/ddd';

export class UpdateConditionReeferCommand extends Command {
  readonly conditionReeferId: bigint;
  readonly operationCode?: string | null;
  readonly conditionCode?: string | null;
  readonly conditionMachineCode?: string | null;
  readonly isDamage?: boolean | null;
  readonly mappingCode?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateConditionReeferCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
