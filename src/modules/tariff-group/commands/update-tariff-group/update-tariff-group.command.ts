import { Command, CommandProps } from '@libs/ddd';

export class UpdateTariffGroupCommand extends Command {
  readonly tariffGroupId: bigint;
  // Add more properties here
  readonly groupTrfCode?: string | null;
  readonly groupTrfName?: string | null;
  readonly laborRate?: number | null;
  readonly isDry?: boolean | null;
  readonly isReefer?: boolean | null;
  readonly isTank?: boolean | null;
  readonly operationCode?: string[] | null;
  readonly vendorCode?: string | null;
  readonly isTerminal?: boolean | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateTariffGroupCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
