import { Command, CommandProps } from '@libs/ddd';

export class CreateEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  // Add more properties here
  readonly idEstimate: bigint;
  readonly operationCode: string;
  readonly compCode: string;
  readonly locCode?: string | null;
  readonly damCode?: string | null;
  readonly repCode: string;
  readonly length: number;
  readonly width: number;
  readonly quantity: number;
  readonly payerCode: string;
  readonly symbolCode: string;
  readonly rate: number;
  readonly isClean?: boolean;
  readonly cleanMethodCode?: string | null;
  readonly cleanModeCode?: string | null;
  readonly note?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
