import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  JobRepairCleanAlreadyCompletedError,
  JobRepairCleanAlreadyFinishedError,
  JobRepairCleanAlreadyStartedOrCanceledError,
} from './job-repair-clean.error';
import {
  CancelProps,
  CompleteProps,
  CreateJobRepairCleanProps,
  FinishProps,
  JobRepairCleanProps,
  StartProps,
  UpdateJobRepairCleanProps,
} from './job-repair-clean.type';

export class JobRepairCleanEntity extends AggregateRoot<
  JobRepairCleanProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get idRef(): bigint {
    return this.props.idRef;
  }

  get idCont(): string {
    return this.props.idCont;
  }

  get id(): bigint {
    return this._id;
  }

  get idJob(): string {
    return this.props.idJob;
  }

  get seq(): number {
    return this.props.seq;
  }

  get repCode(): string {
    return this.props.repCode;
  }

  get idEstItem(): bigint | null {
    return this.props.idEstItem || null;
  }

  get cleanMethodCode(): string | null {
    return this.props.cleanMethodCode || null;
  }

  get cleanModeCode(): string | null {
    return this.props.cleanModeCode || null;
  }

  get containerNo(): string {
    return this.props.containerNo;
  }

  get estimateNo(): string {
    return this.props.estimateNo;
  }

  get isClean(): boolean | undefined {
    return this.props.isClean;
  }

  get startBy(): string | null | undefined {
    return this.props.startBy;
  }

  get startDate(): Date | null | undefined {
    return this.props.startDate;
  }

  get finishBy(): string | null | undefined {
    return this.props.finishBy;
  }

  get finishDate(): Date | null | undefined {
    return this.props.finishDate;
  }

  get cancelBy(): string | null | undefined {
    return this.props.cancelBy;
  }

  get cancelDate(): Date | null | undefined {
    return this.props.cancelDate;
  }

  get completeBy(): string | null | undefined {
    return this.props.completeBy;
  }

  get completeDate(): Date | null | undefined {
    return this.props.completeDate;
  }

  get vendorCode(): string | null | undefined {
    return this.props.vendorCode;
  }

  get isReclean(): boolean {
    return this.props.isReclean;
  }

  get idRefReclean(): bigint | null | undefined {
    return this.props.idRefReclean;
  }

  get kcsStatus(): number {
    return this.props.kcsStatus;
  }

  get kcsNote(): string | null | undefined {
    return this.props.kcsNote;
  }

  get note(): string | null | undefined {
    return this.props.note;
  }

  get jobStatus(): string {
    return this.props.jobStatus;
  }

  static create(props: CreateJobRepairCleanProps): JobRepairCleanEntity {
    return new JobRepairCleanEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateJobRepairCleanProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  start(props: StartProps): Result<any, any> {
    this.props.jobStatus = 'R';
    this.props.startBy = props.startBy;
    this.props.startDate = new Date();

    return Ok(null);
  }

  finish(props: FinishProps): Result<any, JobRepairCleanAlreadyFinishedError> {
    if (this.props.finishBy) {
      return Err(new JobRepairCleanAlreadyFinishedError());
    }

    this.props.jobStatus = 'C';
    this.props.finishBy = props.finishBy;
    this.props.finishDate = new Date();

    return Ok(null);
  }

  cancel(
    props: CancelProps,
  ): Result<any, JobRepairCleanAlreadyStartedOrCanceledError> {
    if (this.props.finishBy) {
      return Err(new JobRepairCleanAlreadyStartedOrCanceledError());
    }

    this.props.jobStatus = 'X';
    this.props.cancelBy = props.cancelBy;
    this.props.cancelDate = new Date();

    return Ok(null);
  }

  complete(
    props: CompleteProps,
  ): Result<any, JobRepairCleanAlreadyCompletedError> {
    if (this.props.completeBy) {
      return Err(new JobRepairCleanAlreadyCompletedError());
    }
    const now = new Date();
    this.props.jobStatus = 'C';
    this.props.completeBy = props.completeBy;
    this.props.completeDate = now;
    // Nếu finish null thì update theo complete
    this.props.finishBy = this.props.finishBy ?? props.completeBy;
    this.props.finishDate = this.props.finishDate ?? now;

    return Ok(null);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
