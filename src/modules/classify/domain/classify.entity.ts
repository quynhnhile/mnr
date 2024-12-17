import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { ClassifyCodeAlreadyInUseError } from './classify.error';
import {
  ClassifyProps,
  CreateClassifyProps,
  UpdateClassifyProps,
} from './classify.type';

export class ClassifyEntity extends AggregateRoot<ClassifyProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateClassifyProps): ClassifyEntity {
    return new ClassifyEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateClassifyProps,
  ): Result<unknown, ClassifyCodeAlreadyInUseError> {
    if (
      props.classifyCode &&
      this.props.classifyCode !== props.classifyCode &&
      this.props?.inUseCount
    ) {
      return Err(new ClassifyCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ClassifyCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new ClassifyCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
