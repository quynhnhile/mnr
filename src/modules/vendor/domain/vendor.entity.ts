import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { VendorCodeAlreadyInUseError } from './vendor.error';
import {
  VendorProps,
  UpdateVendorProps,
  CreateVendorProps,
} from './vendor.type';

export class VendorEntity extends AggregateRoot<VendorProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateVendorProps): VendorEntity {
    return new VendorEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateVendorProps,
  ): Result<unknown, VendorCodeAlreadyInUseError> {
    // Ensure that the vendor code is not already in use in case of updating vendor code
    if (
      props.vendorCode &&
      this.props.vendorCode !== props.vendorCode &&
      this.props?.inUseCount
    ) {
      return Err(new VendorCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, VendorCodeAlreadyInUseError> {
    // Ensure that the vendor is not in use in other entities
    if (this.props.inUseCount) {
      return Err(new VendorCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
