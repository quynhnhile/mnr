import { Command, CommandProps } from '@libs/ddd';

export class UpdateRepairCommand extends Command {
  readonly repairId: bigint;
  // Add more properties here
  readonly operationCode?: string | null;
  readonly repCode?: string | null;
  readonly repNameEn?: string | null;
  readonly repNameVi?: string | null;
  readonly isClean?: boolean | null;
  readonly isRepair?: boolean | null;
  readonly isPti?: boolean | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateRepairCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
