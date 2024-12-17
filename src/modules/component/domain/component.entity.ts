import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { ComponentCodeAlreadyInUseError } from './component.error';
import {
  ComponentProps,
  CreateComponentProps,
  UpdateComponentProps,
} from './component.type';

export class ComponentEntity extends AggregateRoot<ComponentProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateComponentProps): ComponentEntity {
    return new ComponentEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateComponentProps,
  ): Result<unknown, ComponentCodeAlreadyInUseError> {
    if (
      props.compCode &&
      this.props.compCode !== props.compCode &&
      this.props?.inUseCount
    ) {
      return Err(new ComponentCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ComponentCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new ComponentCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
