import { Command, CommandProps } from '@libs/ddd';

export class UpdateComponentCommand extends Command {
  readonly componentId: bigint;
  // Add more properties here
  readonly operationCode?: string | null;
  readonly compCode?: string | null;
  readonly compNameEn?: string | null;
  readonly compNameVi?: string | null;
  readonly assembly?: string | null;
  readonly side?: string | null;
  readonly contType?: string | null;
  readonly materialCode?: string | null;
  readonly isMachine?: boolean | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateComponentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
