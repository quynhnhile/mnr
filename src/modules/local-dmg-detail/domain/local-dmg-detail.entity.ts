import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateLocalDmgDetailProps,
  LocalDmgDetailProps,
  UpdateLocalDmgDetailProps,
} from './local-dmg-detail.type';

export class LocalDmgDetailEntity extends AggregateRoot<
  LocalDmgDetailProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateLocalDmgDetailProps): LocalDmgDetailEntity {
    return new LocalDmgDetailEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateLocalDmgDetailProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
