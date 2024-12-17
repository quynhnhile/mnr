import { Command, CommandProps } from '@libs/ddd';

export class CreateSysConfigOprCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly policyInfo?: string;
  readonly discountRate?: number;
  readonly amount?: number;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateSysConfigOprCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
