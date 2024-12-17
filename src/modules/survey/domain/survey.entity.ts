import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { SurveyDetailEntity } from './survey-detail.entity';
import {
  CreateSurveyProps,
  FinishSurveyProps,
  SurveyProps,
  UpdateSurveyProps,
} from './survey.type';

export class SurveyEntity extends AggregateRoot<SurveyProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;
  get contAge(): string | undefined {
    return this.props.contAge;
  }

  get machineAge(): string | undefined {
    return this.props.machineAge;
  }

  get machineBrand(): string | undefined {
    return this.props.machineBrand;
  }

  get machineModel(): string | undefined {
    return this.props.machineModel;
  }

  get idCont(): string {
    return this.props.idCont;
  }

  get surveyNo(): string {
    return this.props.surveyNo;
  }

  get containerNo(): string {
    return this.props.containerNo;
  }

  get conditionCode(): string | undefined {
    return this.props.conditionCode;
  }

  get classifyCode(): string | undefined {
    return this.props.classifyCode;
  }

  get conditionMachineCode(): string | undefined {
    return this.props.conditionMachineCode;
  }

  static create(props: CreateSurveyProps): SurveyEntity {
    return new SurveyEntity({
      id: BigInt(0),
      props: {
        ...props,
        surveyDetails: props.surveyDetails.map((surveyDetail) => {
          const { idSurvey, surveyDate, surveyBy, ...restSurveyDetailProps } =
            surveyDetail;
          return new SurveyDetailEntity({
            id: BigInt(0),
            props: {
              idSurvey: idSurvey ?? BigInt(0),
              idCont: props.idCont,
              ...restSurveyDetailProps,
              surveyNo: props.surveyNo,
              surveyDate: surveyDate ?? props.surveyDate,
              surveyBy: surveyBy ?? props.surveyBy,
            },
            skipValidation: true,
          });
        }),
      },
    });
  }

  finish(props: FinishSurveyProps): void {
    this.props.finishBy = props.finishBy;
    this.props.finishDate = new Date();
    this.props.machineAge = props.machineAge ?? this.props.machineAge;
    this.props.machineBrand = props.machineBrand ?? this.props.machineBrand;
    this.props.machineModel = props.machineModel ?? this.props.machineModel;
    this.props.conditionMachineCode =
      props.conditionMachineCode ?? this.props.conditionMachineCode;
    this.props.pti = props.pti ?? this.props.pti;
    this.props.noteMachine = props.noteMachine ?? this.props.noteMachine;
  }

  update(props: UpdateSurveyProps): void {
    copyNonUndefinedProps(this.props, props, ['surveyDetails']);
  }

  delete(): void {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
