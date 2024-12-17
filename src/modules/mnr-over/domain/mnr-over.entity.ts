import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateMnrOverProps,
  MnrOverProps,
  UpdateMnrOverProps,
} from './mnr-over.type';

export class MnrOverEntity extends AggregateRoot<MnrOverProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateMnrOverProps): MnrOverEntity {
    return new MnrOverEntity({
      id: BigInt(0),
      props: {
        ...props,
        statusTypeCode: props.statusTypeCode ?? '*',
        contType: props.contType ?? '*',
        jobModeCode: props.jobModeCode ?? '*',
        methodCode: props.methodCode ?? '*',
      },
    });
  }

  async update(props: UpdateMnrOverProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
