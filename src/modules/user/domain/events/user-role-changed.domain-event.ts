import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { UserEntity } from '../user.entity';
import { UserRoles } from '../user.types';

export class UserRoleChangedDomainEvent extends DomainEvent<UserEntity['id']> {
  readonly oldRole: UserRoles;

  readonly newRole: UserRoles;

  constructor(props: DomainEventProps<UserRoleChangedDomainEvent>) {
    super(props);
    this.oldRole = props.oldRole;
    this.newRole = props.newRole;
  }
}
