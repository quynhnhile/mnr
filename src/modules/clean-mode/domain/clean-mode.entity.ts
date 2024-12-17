import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { CleanModeCodeAlreadyInUseError } from './clean-mode.error';
import {
  CleanModeProps,
  CreateCleanModeProps,
  UpdateCleanModeProps,
} from './clean-mode.type';

export class CleanModeEntity extends AggregateRoot<CleanModeProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateCleanModeProps): CleanModeEntity {
    return new CleanModeEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateCleanModeProps,
  ): Result<unknown, CleanModeCodeAlreadyInUseError> {
    if (
      props.cleanModeCode &&
      this.props.cleanModeCode !== props.cleanModeCode &&
      this.props?.inUseCount
    ) {
      return Err(new CleanModeCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, CleanModeCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new CleanModeCodeAlreadyInUseError());
    }
    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
