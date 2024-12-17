import { Ok, Result } from 'oxide.ts';
import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { EstimateDetailEntity } from './estimate-detail.entity';
import {
  EstimateAlreadyApprovedError,
  EstimateAlreadyCanceledError,
  EstimateAlreadyLocalApprovedError,
  EstimateAlreadyRequestedActiveError,
  EstimateAlreadySentOperationError,
} from './estimate.error';
import {
  ApproveEstimateProps,
  CancelEstimateProps,
  CreateEstimateProps,
  EstimateProps,
  EstimateStatus,
  LocalApproveEstimateProps,
  RequestActiveEstimateProps,
  SendOperationProps,
  UpdateEstimateProps,
} from './estimate.type';

export class EstimateEntity extends AggregateRoot<EstimateProps, bigint> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;

  get idRef(): bigint {
    return this.props.idRef;
  }

  get idCont(): string {
    return this.props.idCont;
  }

  get containerNo(): string {
    return this.props.containerNo;
  }

  get estimateNo(): string {
    return this.props.estimateNo;
  }

  get estimateDetails(): EstimateDetailEntity[] {
    return this.props.estimateDetails;
  }

  static create(props: CreateEstimateProps): EstimateEntity {
    return new EstimateEntity({
      id: BigInt(0),
      props: {
        ...props,
        estimateDetails: props.estimateDetails.map((estimateDetail) => {
          const {} = estimateDetail;
          return new EstimateDetailEntity({
            id: BigInt(0),
            props: {
              ...estimateDetail,
              square: estimateDetail.length * estimateDetail.width,
              statusCode: EstimateStatus.ESTIMATE,
              jobRepairCleans: [],
            },
            skipValidation: true,
          });
        }),
      },
    });
  }

  update(props: UpdateEstimateProps): void {
    copyNonUndefinedProps(this.props, props);
  }

  approveLocal(
    props: LocalApproveEstimateProps,
  ): Result<any, EstimateAlreadyLocalApprovedError> {
    this.props.statusCode = EstimateStatus.LOCAL;
    this.props.localApprovalBy = props.localApprovalBy;
    this.props.localApprovalDate = new Date();
    this.props.statusCode = 'L';

    return Ok(null);
  }

  sendOperation(
    props: SendOperationProps,
  ): Result<any, EstimateAlreadySentOperationError> {
    this.props.statusCode = EstimateStatus.WAITING;
    this.props.sendOprBy = props.sendOprBy;
    this.props.sendOprDate = new Date();

    return Ok(null);
  }

  approve(
    props: ApproveEstimateProps,
  ): Result<any, EstimateAlreadyApprovedError> {
    this.props.statusCode = EstimateStatus.APPROVAL;
    this.props.approvalBy = props.approvalBy;
    this.props.approvalDate = new Date();
    this.props.statusCode = 'A';

    return Ok(null);
  }

  cancel(
    props: CancelEstimateProps,
  ): Result<any, EstimateAlreadyCanceledError> {
    this.props.statusCode = EstimateStatus.CANCEL;
    this.props.cancelBy = props.cancelBy;
    this.props.isOprCancel = props.isOprCancel;
    this.props.cancelDate = new Date();
    this.props.statusCode = 'X';

    return Ok(null);
  }

  requestActive(
    props: RequestActiveEstimateProps,
  ): Result<any, EstimateAlreadyRequestedActiveError> {
    this.props.reqActiveBy = props.reqActiveBy;
    this.props.reqActiveDate = new Date();
    this.props.statusCode = 'W';

    return Ok(null);
  }

  delete(): void {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
