import { ValueObject } from '@libs/ddd';

export interface RequestUserPermissionsProps {
  rsname: string;
  rsid: string;
  scopes: string[];
}

export interface RequestUserProps {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  scope: string;
  permissions: RequestUserPermissions[];
  terminals: string[];
}

export class RequestUserPermissions extends ValueObject<RequestUserPermissionsProps> {
  get rsname(): string {
    return this.props.rsname;
  }

  get rsid(): string {
    return this.props.rsid;
  }

  get scopes(): string[] {
    return this.props.scopes;
  }

  protected validate(props: RequestUserPermissionsProps): void {
    void props;
  }
}

export class RequestUser extends ValueObject<RequestUserProps> {
  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get scope(): string {
    return this.props.scope;
  }

  get permissions(): RequestUserPermissions[] {
    return this.props.permissions;
  }

  get terminals(): string[] {
    return this.props.terminals || [];
  }

  protected validate(props: RequestUserProps): void {
    void props;
  }
}
