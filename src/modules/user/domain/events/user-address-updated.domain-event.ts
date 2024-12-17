import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { UserEntity } from '../user.entity';

export class UserAddressUpdatedDomainEvent extends DomainEvent<
  UserEntity['id']
> {
  public readonly country: string;

  public readonly street: string;

  public readonly postalCode: string;

  constructor(props: DomainEventProps<UserAddressUpdatedDomainEvent>) {
    super(props);
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}
