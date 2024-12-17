import { Command, CommandProps } from '@libs/ddd';

export class UpdateClassifyCommand extends Command {
  readonly classifyId: bigint;
  // Add more properties here
  readonly operationCode?: string;
  readonly classifyCode?: string;
  readonly classifyName?: string;
  readonly mappingCode?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateClassifyCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
