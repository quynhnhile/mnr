import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { DamageCodeAlreadyInUseError } from './damage.error';
import {
  CreateDamageProps,
  DamageProps,
  UpdateDamageProps,
} from './damage.type';

export class DamageEntity extends AggregateRoot<DamageProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;
  get operationCode(): string | null | undefined {
    return this.props.operationCode;
  }

  static create(props: CreateDamageProps): DamageEntity {
    return new DamageEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateDamageProps,
  ): Result<unknown, DamageCodeAlreadyInUseError> {
    if (
      props.damCode &&
      this.props.damCode !== props.damCode &&
      this.props?.inUseCount
    ) {
      return Err(new DamageCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, DamageCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new DamageCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
