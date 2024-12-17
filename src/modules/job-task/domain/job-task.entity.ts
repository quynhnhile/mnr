import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { JobTaskCodeAlreadyInUseError } from './job-task.error';
import {
  CreateJobTaskProps,
  JobTaskProps,
  UpdateJobTaskProps,
} from './job-task.type';

export class JobTaskEntity extends AggregateRoot<JobTaskProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateJobTaskProps): JobTaskEntity {
    return new JobTaskEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateJobTaskProps,
  ): Result<unknown, JobTaskCodeAlreadyInUseError> {
    if (
      props.jobTaskCode &&
      this.props.jobTaskCode !== props.jobTaskCode &&
      this.props?.inUseCount
    ) {
      return Err(new JobTaskCodeAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, JobTaskCodeAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new JobTaskCodeAlreadyInUseError());
    }
    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
