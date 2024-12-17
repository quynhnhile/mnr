import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { ConditionCodeAlreadyInUseError } from './condition.error';
import {
  ConditionProps,
  CreateConditionProps,
  UpdateConditionProps,
} from './condition.type';

export class ConditionEntity extends AggregateRoot<ConditionProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateConditionProps): ConditionEntity {
    return new ConditionEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateConditionProps,
  ): Result<unknown, ConditionCodeAlreadyInUseError> {
    if (
      props.conditionCode &&
      this.props.conditionCode !== props.conditionCode &&
      this.props?.inUseCount
    ) {
      return Err(new ConditionCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ConditionCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new ConditionCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
