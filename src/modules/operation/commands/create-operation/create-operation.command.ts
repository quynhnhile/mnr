import { Command, CommandProps } from '@libs/ddd';

export class CreateOperationCommand extends Command {
  readonly operationCode: string;
  readonly operationName: string;
  // readonly isEdo: boolean;
  // readonly isLocalForeign: OperationType;
  readonly cleanMethodCode?: string;
  readonly isActive: boolean;
  readonly policyInfo?: string;
  // readonly moneyCredit?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateOperationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
