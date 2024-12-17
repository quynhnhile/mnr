import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateSurveyLocationProps,
  SurveyLocationProps,
  UpdateSurveyLocationProps,
} from './survey-location.type';

export class SurveyLocationEntity extends AggregateRoot<
  SurveyLocationProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  static create(props: CreateSurveyLocationProps): SurveyLocationEntity {
    return new SurveyLocationEntity({
      id: BigInt(0),
      props,
    });
  }

  async update(props: UpdateSurveyLocationProps): Promise<void> {
    copyNonUndefinedProps(this.props, props);
  }

  async delete(): Promise<void> {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
