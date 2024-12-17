import { Command, CommandProps } from '@libs/ddd';

export class UpdateTariffCommand extends Command {
  readonly tariffId: bigint;
  // Add more properties here
  readonly groupTrfCode?: string | null;
  readonly compCode?: string | null;
  readonly locCode?: string[] | null;
  readonly damCode?: string | null;
  readonly repCode?: string | null;
  readonly length?: number | null;
  readonly width?: number | null;
  readonly unit?: string | null;
  readonly quantity?: number | null;
  readonly hours?: number | null;
  readonly currency?: string | null;
  readonly mateAmount?: number | null;
  readonly totalAmount?: number | null;
  readonly vat?: number | null | null;
  readonly includeVat?: boolean | null;
  readonly add?: number | null;
  readonly addHours?: number | null;
  readonly addMate?: number | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateTariffCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
