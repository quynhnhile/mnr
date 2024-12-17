import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { RepairCodeAlreadyInUseError } from './repair.error';
import {
  CreateRepairProps,
  RepairProps,
  UpdateRepairProps,
} from './repair.type';

export class RepairEntity extends AggregateRoot<RepairProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get operationCode(): string {
    return this.props.operationCode;
  }

  get isClean(): boolean {
    return this.props.isClean;
  }

  static create(props: CreateRepairProps): RepairEntity {
    return new RepairEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateRepairProps,
  ): Result<unknown, RepairCodeAlreadyInUseError> {
    if (
      props.repCode &&
      this.props.repCode !== props.repCode &&
      this.props?.inUseCount
    ) {
      return Err(new RepairCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, RepairCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new RepairCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
