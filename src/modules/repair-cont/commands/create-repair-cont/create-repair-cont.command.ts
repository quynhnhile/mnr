import { Command, CommandProps } from '@libs/ddd';

export class CreateRepairContCommand extends Command {
  // Add more properties here
  readonly idCont: string;
  readonly pinCode?: string | null;
  readonly orderNo?: string | null;
  readonly conditionCodeAfter?: string | null;
  readonly conditionMachineCodeAfter?: string | null;
  readonly factoryDate?: Date | null;
  readonly surveyInNo?: string | null;
  readonly surveyOutNo?: string | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateRepairContCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
