import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { UserEntity } from '../user.entity';

export class UserDeletedDomainEvent extends DomainEvent<UserEntity['id']> {
  constructor(props: DomainEventProps<UserDeletedDomainEvent>) {
    super(props);
  }
}
