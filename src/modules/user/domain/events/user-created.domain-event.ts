import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { UserEntity } from '../user.entity';

export class UserCreatedDomainEvent extends DomainEvent<UserEntity['id']> {
  readonly email: string;

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}
