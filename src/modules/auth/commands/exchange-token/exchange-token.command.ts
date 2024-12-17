import { Command, CommandProps } from '@libs/ddd';

export class ExchangeTokenCommand extends Command {
  readonly code: string;
  readonly redirectUri: string;

  constructor(props: CommandProps<ExchangeTokenCommand>) {
    super(props);
    this.code = props.code;
    this.redirectUri = props.redirectUri;
  }
}
