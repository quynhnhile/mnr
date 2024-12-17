import { Command, CommandProps } from '@libs/ddd';

export class LogoutCommand extends Command {
  readonly token: string;
  readonly refreshToken: string;

  constructor(props: CommandProps<LogoutCommand>) {
    super(props);
    this.token = props.token;
    this.refreshToken = props.refreshToken;
  }
}
