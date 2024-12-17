import { Command, CommandProps } from '@libs/ddd';

export class UpdateOperationCommand extends Command {
  readonly operationId: bigint;
  readonly updatedBy: string;
  readonly operationCode?: string;
  readonly operationName?: string;
  // readonly isEdo?: boolean;
  // readonly isLocalForeign?: OperationType;
  readonly isActive?: boolean;
  readonly policyInfo?: string;
  readonly cleanMethodCode?: string;
  // readonly moneyCredit?: string;

  constructor(props: CommandProps<UpdateOperationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
