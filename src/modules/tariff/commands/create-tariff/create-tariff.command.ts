import { Command, CommandProps } from '@libs/ddd';

export class CreateTariffCommand extends Command {
  // Add more properties here
  readonly groupTrfCode: string;
  readonly compCode: string;
  readonly locCode?: string[] | null;
  readonly damCode?: string | null;
  readonly repCode: string;
  readonly length: number;
  readonly width: number;
  readonly unit: string;
  readonly quantity: number;
  readonly hours: number;
  readonly currency: string;
  readonly mateAmount: number;
  readonly totalAmount: number;
  readonly vat?: number | null;
  readonly includeVat: boolean;
  readonly add?: number | null;
  readonly addHours?: number | null;
  readonly addMate?: number | null;
  readonly note?: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateTariffCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
