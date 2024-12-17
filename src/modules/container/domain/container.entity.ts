import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  ContainerProps,
  CreateContainerProps,
  UpdateContainerProps,
} from './container.type';

export class ContainerEntity extends AggregateRoot<ContainerProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get operationCode(): string {
    return this.props.operationCode;
  }

  get bookingNo(): string | null | undefined {
    return this.props.bookingNo;
  }

  get blNo(): string | null | undefined {
    return this.props.blNo;
  }

  get localSizeType(): string {
    return this.props.localSizeType;
  }

  get isoSizeType(): string {
    return this.props.isoSizeType;
  }

  get conditionCode(): string | null | undefined {
    return this.props.conditionCode;
  }

  get classifyCode(): string | null | undefined {
    return this.props.classifyCode;
  }

  get conditionMachineCode(): string | null | undefined {
    return this.props.conditionMachineCode;
  }

  get block(): string | null | undefined {
    return this.props.block;
  }

  get bay(): string | null | undefined {
    return this.props.bay;
  }

  get row(): string | null | undefined {
    return this.props.row;
  }

  get tier(): string | null | undefined {
    return this.props.tier;
  }

  get area(): string | null | undefined {
    return this.props.area;
  }

  get id(): bigint {
    return this._id;
  }

  get idCont(): string | null | undefined {
    return this.props.idCont;
  }

  get containerNo(): string {
    return this.props.containerNo;
  }

  static create(props: CreateContainerProps): ContainerEntity {
    return new ContainerEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateContainerProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
