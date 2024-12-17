import { Command, CommandProps } from '@libs/ddd';

export class CreateComponentCommand extends Command {
  // Add more properties here
  readonly operationCode?: string | null;
  readonly compCode: string;
  readonly compNameEn: string;
  readonly compNameVi?: string | null;
  readonly assembly?: string | null;
  readonly side?: string | null;
  readonly contType?: string | null;
  readonly materialCode?: string | null;
  readonly isMachine?: boolean | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateComponentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
