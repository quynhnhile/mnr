import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { VendorTypeCodeAlreadyInUseError } from './vendor-type.error';
import {
  CreateVendorTypeProps,
  UpdateVendorTypeProps,
  VendorTypeProps,
} from './vendor-type.type';

export class VendorTypeEntity extends AggregateRoot<VendorTypeProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateVendorTypeProps): VendorTypeEntity {
    return new VendorTypeEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateVendorTypeProps,
  ): Result<unknown, VendorTypeCodeAlreadyInUseError> {
    // Ensure that the vendor type code is not already in use in case of updating vendor type code
    if (
      props.vendorTypeCode &&
      this.props.vendorTypeCode !== props.vendorTypeCode &&
      this.props?.inUseCount
    ) {
      return Err(new VendorTypeCodeAlreadyInUseError());
    }

    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, VendorTypeCodeAlreadyInUseError> {
    // Ensure that the vendor type is not in use in other entities
    if (this.props.inUseCount) {
      return Err(new VendorTypeCodeAlreadyInUseError());
    }

    return Ok(true);
  }

  validate(): void {
    // Entity business rules validation
  }
}
