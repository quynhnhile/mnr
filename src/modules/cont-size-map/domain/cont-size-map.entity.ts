import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  ContSizeMapProps,
  CreateContSizeMapProps,
  UpdateContSizeMapProps,
} from './cont-size-map.type';

export class ContSizeMapEntity extends AggregateRoot<ContSizeMapProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateContSizeMapProps): ContSizeMapEntity {
    return new ContSizeMapEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateContSizeMapProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
