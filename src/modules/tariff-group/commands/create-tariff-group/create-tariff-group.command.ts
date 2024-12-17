import { Command, CommandProps } from '@libs/ddd';

export class CreateTariffGroupCommand extends Command {
  // Add more properties here
  readonly groupTrfCode: string;
  readonly groupTrfName: string;
  readonly laborRate: number;
  readonly isDry: boolean;
  readonly isReefer: boolean;
  readonly isTank: boolean;
  readonly operationCode?: string[] | null;
  readonly vendorCode?: string | null;
  readonly isTerminal?: boolean | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateTariffGroupCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
