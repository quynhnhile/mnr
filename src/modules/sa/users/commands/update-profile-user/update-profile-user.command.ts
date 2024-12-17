import { Command, CommandProps } from '@libs/ddd';
import { RoleMappingPayload } from '@src/libs/keycloak/defs/role-pepresentation';

export class UpdateProfileUserCommand extends Command {
  readonly userId: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly emailVerified?: boolean;
  readonly attributes?: Record<string, string[]>;
  readonly enabled?: boolean;
  readonly groups: RoleMappingPayload[];

  constructor(props: CommandProps<UpdateProfileUserCommand>) {
    super(props);
    this.userId = props.userId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.emailVerified = props.emailVerified;
    this.attributes = props.attributes;
    this.enabled = props.enabled;
    this.groups = props.groups;
  }
}
