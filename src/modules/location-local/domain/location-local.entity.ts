import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { CreateLocationLocalProps, LocationLocalProps, UpdateLocationLocalProps } from './location-local.type';

export class LocationLocalEntity extends AggregateRoot<LocationLocalProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateLocationLocalProps): LocationLocalEntity {
    return new LocationLocalEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateLocationLocalProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
