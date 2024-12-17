import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import {
  CreateSurveyDetailProps,
  SurveyDetailProps,
  UpdateSurveyDetailProps,
} from './survey-detail.type';

export class SurveyDetailEntity extends AggregateRoot<
  SurveyDetailProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get idSurvey(): bigint | undefined {
    return this.props.idSurvey;
  }

  get surveyDate(): Date {
    return this.props.surveyDate;
  }

  get surveyBy(): string {
    return this.props.surveyBy;
  }

  static create(props: CreateSurveyDetailProps): SurveyDetailEntity {
    return new SurveyDetailEntity({
      id: BigInt(0),
      props: {
        ...props,
        idCont: props.idCont ?? '', // fix this
        idSurvey: props.idSurvey ?? BigInt(0),
        surveyDate: props.surveyDate ?? new Date(),
      },
    });
  }

  update(props: UpdateSurveyDetailProps): void {
    copyNonUndefinedProps(this.props, props);
  }

  delete(): void {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
