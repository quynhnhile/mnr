import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { CleanMethodCodeAlreadyInUseError } from './clean-method.error';
import {
  CleanMethodProps,
  CreateCleanMethodProps,
  UpdateCleanMethodProps,
} from './clean-method.type';

export class CleanMethodEntity extends AggregateRoot<CleanMethodProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateCleanMethodProps): CleanMethodEntity {
    return new CleanMethodEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateCleanMethodProps,
  ): Result<unknown, CleanMethodCodeAlreadyInUseError> {
    if (
      props.cleanMethodCode &&
      this.props.cleanMethodCode !== props.cleanMethodCode &&
      this.props?.inUseCount
    ) {
      return Err(new CleanMethodCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, CleanMethodCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new CleanMethodCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
