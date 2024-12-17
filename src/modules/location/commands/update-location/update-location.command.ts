import { Command, CommandProps } from '@libs/ddd';

export class UpdateLocationCommand extends Command {
  readonly locationId: bigint;
  readonly locCode?: string;
  readonly locNameEn?: string;
  readonly locNameVi?: string;
  readonly side?: string;
  readonly size?: number;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateLocationCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
