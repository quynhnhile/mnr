import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateRepairContProps,
  RepairContProps,
  UpdateCompleteProps,
  UpdateRepairContProps,
} from './repair-cont.type';

export class RepairContEntity extends AggregateRoot<RepairContProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;
  get estimateNo(): string | null | undefined {
    return this.props.estimateNo;
  }

  get id(): bigint {
    return this._id;
  }

  get idCont(): string {
    return this.props.idCont;
  }

  get containerNo(): string {
    return this.props.containerNo;
  }

  static create(props: CreateRepairContProps): RepairContEntity {
    return new RepairContEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateRepairContProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async complete(props: UpdateCompleteProps): Promise<void> {
    this.props.isComplete = true;
    // this.props.completeDate = new Date();
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
