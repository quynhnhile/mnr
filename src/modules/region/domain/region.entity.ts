import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { RegionCodeAlreadyInUseError } from './region.error';
import {
  CreateRegionProps,
  RegionProps,
  UpdateRegionProps,
} from './region.type';

export class RegionEntity extends AggregateRoot<RegionProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get regionCode(): string {
    return this.props.regionCode;
  }

  get sort(): number {
    return this.props.sort ?? 99;
  }

  static create(props: CreateRegionProps): RegionEntity {
    return new RegionEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateRegionProps,
  ): Result<unknown, RegionCodeAlreadyInUseError> {
    // Ensure that the plan mode code is not already in use in case of updating plan mode code
    if (
      props.regionCode &&
      this.props.regionCode !== props.regionCode &&
      this.props?.inUseCount
    ) {
      return Err(new RegionCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, RegionCodeAlreadyInUseError> {
    // Ensure that the plan mode is not in use in other entities
    if (this.props.inUseCount) {
      return Err(new RegionCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
