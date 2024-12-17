import { Command, CommandProps } from '@libs/ddd';

export class ExchangeDeviceAuthTokenCommand extends Command {
  readonly deviceCode: string;

  constructor(props: CommandProps<ExchangeDeviceAuthTokenCommand>) {
    super(props);
    this.deviceCode = props.deviceCode;
  }
}
