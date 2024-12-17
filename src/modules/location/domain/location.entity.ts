import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { LocationCodeAlreadyInUseError } from './location.error';
import {
  CreateLocationProps,
  LocationProps,
  UpdateLocationProps,
} from './location.type';

export class LocationEntity extends AggregateRoot<LocationProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateLocationProps): LocationEntity {
    return new LocationEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateLocationProps,
  ): Result<unknown, LocationCodeAlreadyInUseError> {
    if (
      props.locCode &&
      this.props.locCode !== props.locCode &&
      this.props?.inUseCount
    ) {
      return Err(new LocationCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, LocationCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new LocationCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
