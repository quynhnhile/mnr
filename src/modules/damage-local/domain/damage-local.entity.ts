import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateDamageLocalProps,
  DamageLocalProps,
  UpdateDamageLocalProps,
} from './damage-local.type';

export class DamageLocalEntity extends AggregateRoot<DamageLocalProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateDamageLocalProps): DamageLocalEntity {
    return new DamageLocalEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateDamageLocalProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
