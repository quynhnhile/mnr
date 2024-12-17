import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { OperationCodeAlreadyInUseError } from './operation.error';
import {
  CreateOperationProps,
  OperationProps,
  OperationType,
  UpdateOperationProps,
} from './operation.type';

export class OperationEntity extends AggregateRoot<OperationProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateOperationProps): OperationEntity {
    return new OperationEntity({
      id: BigInt(0),
      props: {
        ...props,
        isEdo: props.isEdo !== undefined ? props.isEdo : false,
        isLocalForeign: props.isLocalForeign || OperationType.LOCAL,
        moneyCredit: props.moneyCredit || 'M',
      },
    });
  }

  update(
    props: UpdateOperationProps,
  ): Result<unknown, OperationCodeAlreadyInUseError> {
    if (
      props.operationCode &&
      this.props.operationCode !== props.operationCode &&
      this.props?.inUseCount
    ) {
      return Err(new OperationCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, OperationCodeAlreadyInUseError> {
    // Entity business rules validation
    if (this.props.inUseCount) {
      return Err(new OperationCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
