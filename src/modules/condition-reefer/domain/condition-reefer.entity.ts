import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { CreateConditionReeferProps, ConditionReeferProps, UpdateConditionReeferProps } from './condition-reefer.type';

export class ConditionReeferEntity extends AggregateRoot<ConditionReeferProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateConditionReeferProps): ConditionReeferEntity {
    return new ConditionReeferEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateConditionReeferProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
