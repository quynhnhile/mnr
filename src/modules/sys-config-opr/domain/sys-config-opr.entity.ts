import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateSysConfigOprProps,
  SysConfigOprProps,
  UpdateSysConfigOprProps,
} from './sys-config-opr.type';

export class SysConfigOprEntity extends AggregateRoot<
  SysConfigOprProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateSysConfigOprProps): SysConfigOprEntity {
    return new SysConfigOprEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateSysConfigOprProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
