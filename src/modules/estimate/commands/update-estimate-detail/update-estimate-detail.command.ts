import { Command, CommandProps } from '@libs/ddd';

export class UpdateEstimateDetailCommand extends Command {
  readonly estimateId: bigint;
  readonly estimateDetailId: bigint;
  // Add more properties here
  readonly operationCode?: string;
  readonly compCode?: string;
  readonly locCode?: string;
  readonly damCode?: string;
  readonly repCode?: string;
  readonly length?: number;
  readonly width?: number;
  readonly quantity?: number;
  readonly payerCode?: string;
  readonly symbolCode?: string;
  readonly rate?: number;
  readonly isClean?: boolean;
  readonly cleanMethodCode?: string | null;
  readonly cleanModeCode?: string | null;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateEstimateDetailCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
