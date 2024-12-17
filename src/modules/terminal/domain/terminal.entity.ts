import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { TerminalCodeAlreadyInUseError } from './terminal.error';
import {
  CreateTerminalProps,
  TerminalProps,
  UpdateTerminalProps,
} from './terminal.type';

export class TerminalEntity extends AggregateRoot<TerminalProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get regionCode(): string {
    return this.props.regionCode;
  }

  static create(props: CreateTerminalProps): TerminalEntity {
    return new TerminalEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateTerminalProps,
  ): Result<unknown, TerminalCodeAlreadyInUseError> {
    // Ensure that the plan mode code is not already in use in case of updating plan mode code
    if (
      props.terminalCode &&
      this.props.terminalCode !== props.terminalCode &&
      this.props?.inUseCount
    ) {
      return Err(new TerminalCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, TerminalCodeAlreadyInUseError> {
    // Ensure that the plan mode is not in use in other entities
    if (this.props.inUseCount) {
      return Err(new TerminalCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
