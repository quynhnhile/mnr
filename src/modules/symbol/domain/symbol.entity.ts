import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateSymbolProps,
  SymbolProps,
  UpdateSymbolProps,
} from './symbol.type';
import { SymbolCodeAlreadyInUseError } from './symbol.error';
import { Err, Ok, Result } from 'oxide.ts';

export class SymbolEntity extends AggregateRoot<SymbolProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateSymbolProps): SymbolEntity {
    return new SymbolEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateSymbolProps,
  ): Result<unknown, SymbolCodeAlreadyInUseError> {
    if (
      props.symbolCode &&
      this.props.symbolCode !== props.symbolCode &&
      this.props?.inUseCount
    ) {
      return Err(new SymbolCodeAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, SymbolCodeAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new SymbolCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
