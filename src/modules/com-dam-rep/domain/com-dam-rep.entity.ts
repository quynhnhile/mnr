import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  ComDamRepProps,
  CreateComDamRepProps,
  UpdateComDamRepProps,
} from './com-dam-rep.type';

export class ComDamRepEntity extends AggregateRoot<ComDamRepProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateComDamRepProps): ComDamRepEntity {
    return new ComDamRepEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateComDamRepProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
