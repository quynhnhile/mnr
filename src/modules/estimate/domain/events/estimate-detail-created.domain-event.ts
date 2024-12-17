import { DomainEvent, DomainEventProps } from '@libs/ddd';
import { EstimateDetailEntity } from '../estimate-detail.entity';

// interface EstimateDetailCreatedUpdatedDomainEventProps
//   extends DomainEventProps<EstimateDetailCreatedUpdatedDomainEvent> {
//   aggregateOpr: string; // Thêm thuộc tính này vào interface
// }

export class EstimateDetailCreatedUpdatedDomainEvent extends DomainEvent<
  EstimateDetailEntity['id']
> {
  aggregateOpr: string;
  constructor(
    props: DomainEventProps<EstimateDetailCreatedUpdatedDomainEvent>,
  ) {
    super(props);
    this.aggregateOpr = props.aggregateOpr;
  }
}

// export class EstimateDetailCreatedUpdatedDomainEvent extends DomainEvent<
//   EstimateDetailEntity['id']
// > {
//   aggregateOpr: string;
//   constructor(props: EstimateDetailCreatedUpdatedDomainEventProps) {
//     super(props);
//   }
// }
