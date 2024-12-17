import { Command, CommandProps } from '@libs/ddd';

export class CreateConditionReeferCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly conditionCode: string;
  readonly conditionMachineCode: string;
  readonly isDamage: boolean;
  readonly mappingCode: string;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateConditionReeferCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
