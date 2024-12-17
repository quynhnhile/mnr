import { Command, CommandProps } from '@libs/ddd';

export class CreateRepairCommand extends Command {
  // Add more properties here
  readonly operationCode: string;
  readonly repCode: string;
  readonly repNameEn: string;
  readonly repNameVi?: string | null;
  readonly isClean: boolean;
  readonly isRepair: boolean;
  readonly isPti: boolean;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateRepairCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
