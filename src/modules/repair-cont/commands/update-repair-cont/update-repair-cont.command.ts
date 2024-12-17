import { Command, CommandProps } from '@libs/ddd';

export class UpdateRepairContCommand extends Command {
  readonly repairContId: bigint;
  readonly pinCode?: string | null;
  readonly orderNo?: string | null;
  readonly conditionCodeAfter?: string | null;
  readonly conditionMachineCodeAfter?: string | null;
  readonly factoryDate?: Date | null;
  readonly surveyInNo?: string | null;
  readonly surveyOutNo?: string | null;
  readonly note?: string | null;
  readonly completeDate?: Date | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateRepairContCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
