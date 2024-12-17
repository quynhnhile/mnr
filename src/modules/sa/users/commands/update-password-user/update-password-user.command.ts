import { Command, CommandProps } from '@libs/ddd';
import CredentialRepresentation from '@src/libs/keycloak/defs/credential-representation';

export class UpdatePasswordUserCommand extends Command {
  readonly userId: string;
  readonly credentials?: CredentialRepresentation[];

  constructor(props: CommandProps<UpdatePasswordUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.credentials = props.credentials;
  }
}
