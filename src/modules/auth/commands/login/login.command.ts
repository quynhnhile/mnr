import { Command, CommandProps } from '@libs/ddd';
import { RequestUserPermissionsProps } from '@modules/auth/domain/value-objects/request-user.value-object';

export class LoginCommand extends Command {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly scope: string;
  // readonly userName: string;
  readonly terminals: string[];
  readonly permissions: RequestUserPermissionsProps[];

  constructor(props: CommandProps<LoginCommand>) {
    super(props);
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.scope = props.scope;
    // this.userName = props.userName;
    this.terminals = props.terminals;
    this.permissions = props.permissions;
  }
}
