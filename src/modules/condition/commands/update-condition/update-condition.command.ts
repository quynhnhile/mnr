import { Command, CommandProps } from '@libs/ddd';

export class UpdateConditionCommand extends Command {
  readonly conditionId: bigint;
  // Add more properties here
  readonly operationCode?: string | null;
  readonly conditionCode?: string | null;
  readonly conditionName?: string | null;
  readonly isDamage?: boolean | null;
  readonly isMachine?: boolean | null;
  readonly mappingCode?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateConditionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
