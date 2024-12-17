import { Command, CommandProps } from '@libs/ddd';

export class UpdateRegionCommand extends Command {
  readonly regionId: bigint;
  readonly regionCode?: string;
  readonly regionName?: string;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateRegionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
