import { Command, CommandProps } from '@libs/ddd';
import { CreateEstimateDetailProps } from '@modules/estimate/domain/estimate-detail.type';

export class CreateEstimateCommand extends Command {
  // Add more properties here
  readonly idRef: bigint;
  readonly operationCode: string;
  readonly altEstimateNo?: string | null;
  readonly noteEstimate?: string | null;
  readonly note?: string | null;
  readonly estimateBy: string;
  readonly createdBy: string;

  readonly estimateDetails?: CreateEstimateDetailProps[];

  constructor(props: CommandProps<CreateEstimateCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
