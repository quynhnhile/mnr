import { Command, CommandProps } from '@libs/ddd';

export class FinishSurveyCommand extends Command {
  readonly surveyId: bigint;
  readonly finishBy: string;
  readonly machineAge?: string;
  readonly machineBrand?: string;
  readonly machineModel?: string;
  readonly conditionMachineCode?: string;
  readonly pti?: boolean;
  readonly noteMachine?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<FinishSurveyCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
