import { Command, CommandProps } from '@libs/ddd';

export class UpdateMnrOverCommand extends Command {
  readonly mnrOverId: bigint;
  readonly statusTypeCode?: string;
  readonly contType?: string;
  readonly jobModeCode?: string;
  readonly methodCode?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly pti?: string;
  readonly from?: number;
  readonly to?: number;
  readonly unit?: string;
  readonly quantity?: number;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateMnrOverCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
