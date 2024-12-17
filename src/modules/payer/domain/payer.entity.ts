import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { PayerProps, UpdatePayerProps, CreatePayerProps } from './payer.type';
import { PayerCodeAlreadyInUseError } from './payer.error';

export class PayerEntity extends AggregateRoot<PayerProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreatePayerProps): PayerEntity {
    return new PayerEntity({
      id: BigInt(0),
      props,
    });
  }

  update(props: UpdatePayerProps): Result<unknown, PayerCodeAlreadyInUseError> {
    // Ensure that the plan mode code is not already in use in case of updating plan mode code
    if (
      props.payerCode &&
      this.props.payerCode !== props.payerCode &&
      this.props?.inUseCount
    ) {
      return Err(new PayerCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, PayerCodeAlreadyInUseError> {
    // Ensure that the plan mode is not in use in other entities
    if (this.props.inUseCount) {
      return Err(new PayerCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
