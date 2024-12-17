import { Command, CommandProps } from '@libs/ddd';

export class CreateClassifyCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly classifyCode: string;
  readonly classifyName: string;
  readonly mappingCode?: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateClassifyCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
