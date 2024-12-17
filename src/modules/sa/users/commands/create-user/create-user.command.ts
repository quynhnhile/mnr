import { Command, CommandProps } from '@libs/ddd';
import CredentialRepresentation from '@src/libs/keycloak/defs/credential-representation';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';

export class CreateUserCommand extends Command {
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly attributes: Record<string, string[]>;
  readonly enabled: boolean;
  readonly groups: RoleMappingPayload[];
  readonly credentials: CredentialRepresentation[];

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.username = props.username;
    this.email = props.email;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.emailVerified = props.emailVerified;
    this.attributes = props.attributes;
    this.enabled = props.enabled;
    this.groups = props.groups;
    this.credentials = props.credentials;
  }
}
