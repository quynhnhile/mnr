import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateStatusTypeProps,
  StatusTypeProps,
  UpdateStatusTypeProps,
} from './status-type.type';
import { Result, Err, Ok } from 'oxide.ts';
import { StatusTypeCodeAlreadyInUseError } from './status-type.error';

export class StatusTypeEntity extends AggregateRoot<StatusTypeProps, bigint> {
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateStatusTypeProps): StatusTypeEntity {
    return new StatusTypeEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateStatusTypeProps,
  ): Result<unknown, StatusTypeCodeAlreadyInUseError> {
    if (
      props.statusTypeCode &&
      this.props.statusTypeCode !== props.statusTypeCode &&
      this.props?.inUseCount
    ) {
      return Err(new StatusTypeCodeAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, StatusTypeCodeAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new StatusTypeCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
