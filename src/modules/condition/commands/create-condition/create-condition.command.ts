import { Command, CommandProps } from '@libs/ddd';

export class CreateConditionCommand extends Command {
  readonly operationCode: string;
  readonly conditionCode: string;
  readonly conditionName: string;
  readonly isDamage: boolean;
  readonly isMachine: boolean;
  readonly mappingCode?: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateConditionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
