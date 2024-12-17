import { Command, CommandProps } from '@libs/ddd';

export class UpdateLocalDmgDetailCommand extends Command {
  readonly localDmgDetailId: bigint;
  readonly damLocalCode?: string | null;
  readonly locLocalCode?: string | null;
  readonly symbolCode?: string | null;
  readonly size?: string | null;
  readonly damDesc?: string | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateLocalDmgDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
