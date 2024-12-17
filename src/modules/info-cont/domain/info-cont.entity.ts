import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateInfoContProps,
  InfoContProps,
  UpdateInfoContProps,
} from './info-cont.type';

export class InfoContEntity extends AggregateRoot<InfoContProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get contAge(): string | undefined {
    return this.props.contAge || undefined;
  }

  get machineAge(): string | undefined {
    return this.props.machineAge;
  }

  get machineBrand(): string | undefined {
    return this.props.machineBrand;
  }

  get machineModel(): string | undefined {
    return this.props.machineModel;
  }

  get contType(): string | undefined {
    return this.props.contType || undefined;
  }

  static create(props: CreateInfoContProps): InfoContEntity {
    return new InfoContEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateInfoContProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
