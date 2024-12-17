import { Command, CommandProps } from '@libs/ddd';

export class CreateRegionCommand extends Command {
  readonly regionCode: string;
  readonly regionName: string;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateRegionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
