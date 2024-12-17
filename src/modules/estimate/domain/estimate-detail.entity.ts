import { AggregateID, AggregateRoot } from '@libs/ddd';
import { copyNonUndefinedProps } from '@libs/utils';
import { TariffGroupEntity } from '@modules/tariff-group/domain/tariff-group.entity';
import { TariffEntity } from '@modules/tariff/domain/tariff.entity';
import { JobRepairCleanEntity } from '@src/modules/job-repair-clean/domain/job-repair-clean.entity';
import {
  CreateEstimateDetailProps,
  EstimateDetailProps,
  UpdateEstimateDetailProps,
} from './estimate-detail.type';
import {
  ApproveEstimateProps,
  CancelEstimateProps,
  EstimateStatus,
  LocalApproveEstimateProps,
  RequestActiveEstimateProps,
  SendOperationProps,
} from './estimate.type';

export class EstimateDetailEntity extends AggregateRoot<
  EstimateDetailProps,
  bigint
> {
  // Define more entity methods here
  protected readonly _id: AggregateID<bigint>;
  get localApprovalDate(): Date | null | undefined {
    return this.props.localApprovalDate;
  }

  get localApprovalBy(): string | null | undefined {
    return this.props.localApprovalBy;
  }

  get approvalDate(): Date | null | undefined {
    return this.props.approvalDate;
  }

  get approvalBy(): string | null | undefined {
    return this.props.approvalBy;
  }

  get reqActiveDate(): Date | null | undefined {
    return this.props.reqActiveDate;
  }

  get reqActiveBy(): string | null | undefined {
    return this.props.reqActiveBy;
  }

  get cancelDate(): Date | null | undefined {
    return this.props.cancelDate;
  }

  get cancelBy(): string | null | undefined {
    return this.props.cancelBy;
  }

  get isOprCancel(): boolean | null | undefined {
    return this.props.isOprCancel;
  }

  get estimateNo(): string {
    return this.props.estimateNo;
  }
  get isClean(): boolean | undefined {
    return this.props.isClean;
  }

  get compCode(): string {
    return this.props.compCode;
  }

  get locCode(): string | undefined | null {
    return this.props.locCode;
  }

  get repCode(): string {
    return this.props.repCode;
  }

  get length(): number {
    return this.props.length;
  }

  get width(): number {
    return this.props.width;
  }

  get square(): number {
    return this.props.length * this.props.width;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get cleanMethodCode(): string | null {
    return this.props.cleanMethodCode || null;
  }

  get cleanModeCode(): string | null {
    return this.props.cleanModeCode || null;
  }

  get idEstimate(): bigint {
    return this.props.idEstimate;
  }

  get isRead(): boolean {
    return (
      !!this.props.hours &&
      !!this.props.laborRate &&
      !!this.props.laborPrice &&
      !!this.props.matePrice &&
      !!this.props.total
    );
  }

  get jobRepairCleans(): JobRepairCleanEntity[] {
    return this.props.jobRepairCleans;
  }

  static create(props: CreateEstimateDetailProps): EstimateDetailEntity {
    return new EstimateDetailEntity({
      id: BigInt(0),
      props: {
        ...props,
        square: props.length * props.width,
        statusCode: EstimateStatus.ESTIMATE,
        jobRepairCleans: [],
      },
    });
  }

  update(props: UpdateEstimateDetailProps): void {
    copyNonUndefinedProps(this.props, props);
  }

  approveLocal(props: LocalApproveEstimateProps): void {
    this.props.statusCode = EstimateStatus.LOCAL;
    this.props.localApprovalBy = props.localApprovalBy;
    this.props.statusCode = 'L';
    this.props.localApprovalDate = new Date();
  }

  approve(props: ApproveEstimateProps): void {
    this.props.statusCode = EstimateStatus.APPROVAL;
    this.props.approvalBy = props.approvalBy;
    this.props.statusCode = 'A';
    this.props.approvalDate = new Date();
  }

  cancel(props: CancelEstimateProps): void {
    this.props.statusCode = EstimateStatus.CANCEL;
    this.props.cancelBy = props.cancelBy;
    this.props.statusCode = 'X';
    this.props.isOprCancel = props.isOprCancel;
    this.props.cancelDate = new Date();
  }

  requestActive(props: RequestActiveEstimateProps): void {
    this.props.reqActiveBy = props.reqActiveBy;
    this.props.reqActiveDate = new Date();
  }

  sendOpr(props: SendOperationProps): void {
    this.props.sendOprBy = props.sendOprBy;
    this.props.statusCode = 'W';
    this.props.sendOprDate = new Date();
  }

  /**
   * Công thức tính biểu cước:
   * - (Unit: L,S)
   * * - Labor Price = Hours x Labor Rate
   * * - Mate Price = Mate Price
   * * - Total = (Labor Price + Mate Price) x Quatity
   * - (Unit: Q)
   * * - Labor Price = Hours x Labor Rate
   * * - Mate Price = Mate Price
   * * - Total = (Labor Price + Mate Price)
   * - Bộ xác định cước : COMP + REP + LENGTH + WIDTH + QUANTITY
   */
  calculateTariffByQuantity(
    tariffGroup: TariffGroupEntity,
    tariff: TariffEntity,
  ): void {
    // Entity business rules
    const { laborRate } = tariffGroup;
    const {
      unit,
      quantity,
      hours,
      currency,
      mateAmount,
      add,
      addHours = 0,
    } = tariff;

    if (add) {
      const hourAdd = ((this.props.quantity - quantity) * addHours) / add;
      this.props.hours = hourAdd + hours;

      const mateAmountAdd =
        ((this.props.quantity - quantity) * mateAmount) / add;
      this.props.matePrice = +(mateAmountAdd + mateAmount).toFixed(2);
    } else {
      this.props.hours = +((hours * this.props.quantity) / quantity).toFixed(2);

      this.props.matePrice = +(
        (mateAmount * this.props.quantity) /
        quantity
      ).toFixed(2);
    }

    this.props.laborRate = laborRate;
    this.props.laborPrice = +(this.props.hours * laborRate).toFixed(2);
    this.props.total = +(this.props.laborPrice + this.props.matePrice).toFixed(
      2,
    );
    this.props.unit = unit;
    this.props.currency = currency;
  }

  calculateTariffByLength(
    tariffGroup: TariffGroupEntity,
    tariff: TariffEntity,
  ): void {
    const { laborRate } = tariffGroup;
    const {
      unit,
      length,
      hours,
      currency,
      mateAmount,
      add,
      addHours = 0,
    } = tariff;

    if (add) {
      const hoursAdd = ((this.props.length - length) * addHours) / add;
      this.props.hours = hoursAdd + hours;

      const mateAmountAdd = ((this.props.length - length) * mateAmount) / add;
      this.props.matePrice = +(mateAmountAdd + mateAmount).toFixed(2);
    } else {
      this.props.hours = (hours * this.props.length) / length;

      this.props.matePrice = +(
        (mateAmount * this.props.length) /
        length
      ).toFixed(2);
    }

    this.props.laborRate = laborRate;
    this.props.laborPrice = +(this.props.hours * laborRate).toFixed(2);
    this.props.total = +(this.props.laborPrice + this.props.matePrice).toFixed(
      2,
    );
    this.props.unit = unit;
    this.props.currency = currency;
  }

  calculateTariffBySquare(
    tariffGroup: TariffGroupEntity,
    tariff: TariffEntity,
  ): void {
    const { laborRate } = tariffGroup;
    const {
      unit,
      square,
      hours,
      currency,
      mateAmount,
      add,
      addHours = 0,
    } = tariff;

    if (add) {
      const hoursAdd = ((this.props.square - square) * addHours) / add;
      this.props.hours = hoursAdd + hours;

      const mateAmountAdd = ((this.props.square - square) * mateAmount) / add;
      this.props.matePrice = +(mateAmountAdd + mateAmount).toFixed(2);
    } else {
      this.props.hours = (hours * this.props.square) / square;

      this.props.matePrice = +(
        (mateAmount * this.props.square) /
        square
      ).toFixed(2);
    }

    this.props.laborRate = laborRate;
    this.props.laborPrice = +(this.props.hours * laborRate).toFixed(2);
    this.props.total = +(this.props.laborPrice + this.props.matePrice).toFixed(
      2,
    );
    this.props.unit = unit;
    this.props.currency = currency;
  }

  delete(): void {
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
