import { Command, CommandProps } from '@libs/ddd';

export class CreateJobRepairCleanCommand extends Command {
  // Add more properties here
  readonly idRef: bigint;
  readonly idEstItem: bigint;
  readonly repCode: string;
  readonly vendorCode?: string | null;
  readonly startBy?: string | null;
  readonly startDate?: Date | null;
  readonly isReclean: boolean;
  readonly idRefReclean?: bigint | null;
  readonly recleanReason?: string | null;
  readonly note?: string | null;

  readonly createdBy: string;

  constructor(props: CommandProps<CreateJobRepairCleanCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
