import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { TariffGroupCodeAlreadyInUseError } from './tariff-group.error';
import {
  CreateTariffGroupProps,
  TariffGroupProps,
  UpdateTariffGroupProps,
} from './tariff-group.type';

export class TariffGroupEntity extends AggregateRoot<TariffGroupProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;
  get groupTrfCode(): string {
    return this.props.groupTrfCode;
  }

  get operationCode(): string[] {
    return this.props.operationCode || [];
  }

  get laborRate(): number {
    return this.props.laborRate;
  }

  static create(props: CreateTariffGroupProps): TariffGroupEntity {
    return new TariffGroupEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateTariffGroupProps,
  ): Result<unknown, TariffGroupCodeAlreadyInUseError> {
    if (
      props.groupTrfCode &&
      this.props.groupTrfCode !== props.groupTrfCode &&
      this.props?.inUseCount
    ) {
      return Err(new TariffGroupCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, TariffGroupCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new TariffGroupCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
