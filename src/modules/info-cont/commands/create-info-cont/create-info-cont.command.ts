import { Command, CommandProps } from '@libs/ddd';

export class CreateInfoContCommand extends Command {
  // Add more properties here
  readonly createdBy: string;
  readonly containerNo: string;
  readonly operationCode: string;
  readonly ownerCode?: string;
  readonly localSizeType: string;
  readonly isoSizeType: string;
  readonly contType: string;
  readonly contAge: string;
  readonly machineAge?: string;
  readonly machineBrand?: string;
  readonly machineModel?: string;
  readonly tareWeight?: number;
  readonly maxGrossWeight?: number;
  readonly net?: number;
  readonly capacity?: number;
  readonly lastTest?: string;
  readonly typeTest?: string;
  readonly note?: string;

  constructor(props: CommandProps<CreateInfoContCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
