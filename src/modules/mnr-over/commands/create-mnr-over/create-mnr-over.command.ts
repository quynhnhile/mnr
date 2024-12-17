import { Command, CommandProps } from '@libs/ddd';

export class CreateMnrOverCommand extends Command {
  readonly statusTypeCode: string;
  readonly contType: string;
  readonly jobModeCode: string;
  readonly methodCode: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly pti?: string;
  readonly from: number;
  readonly to: number;
  readonly unit: string;
  readonly quantity: number;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateMnrOverCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
