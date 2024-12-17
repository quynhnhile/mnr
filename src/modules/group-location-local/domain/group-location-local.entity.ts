import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { GroupLocationLocalCodeAlreadyInUseError } from './group-location-local.error';
import {
  CreateGroupLocationLocalProps,
  GroupLocationLocalProps,
  UpdateGroupLocationLocalProps,
} from './group-location-local.type';

export class GroupLocationLocalEntity extends AggregateRoot<
  GroupLocationLocalProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(
    props: CreateGroupLocationLocalProps,
  ): GroupLocationLocalEntity {
    return new GroupLocationLocalEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateGroupLocationLocalProps,
  ): Result<unknown, GroupLocationLocalCodeAlreadyInUseError> {
    if (
      props.groupLocLocalCode &&
      this.props.groupLocLocalCode !== props.groupLocLocalCode &&
      this.props?.inUseCount
    ) {
      return Err(new GroupLocationLocalCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, GroupLocationLocalCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new GroupLocationLocalCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
