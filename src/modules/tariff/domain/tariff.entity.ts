import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateTariffProps,
  TariffProps,
  UpdateTariffProps,
} from './tariff.type';

export class TariffEntity extends AggregateRoot<TariffProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get groupTrfCode(): string {
    return this.props.groupTrfCode;
  }

  get unit(): string {
    return this.props.unit;
  }

  get length(): number {
    return this.props.length;
  }

  get square(): number {
    return this.props.square;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get hours(): number {
    return this.props.hours;
  }

  get currency(): string {
    return this.props.currency;
  }

  get mateAmount(): number {
    return this.props.mateAmount;
  }

  get add(): number | undefined {
    return this.props.add || undefined;
  }

  get addHours(): number | undefined {
    return this.props.addHours || undefined;
  }

  get locCode(): string[] {
    return this.props.locCode || [];
  }

  static create(props: CreateTariffProps): TariffEntity {
    return new TariffEntity({
      id: BigInt(0),
      props: {
        ...props,
        square: props.length * props.width,
      },
    });
  }

  update(props: UpdateTariffProps): void {
    copyNonUndefinedProps(this.props, props);
    this.props.square = this.props.length * this.props.width;
  }

  delete(): void {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
