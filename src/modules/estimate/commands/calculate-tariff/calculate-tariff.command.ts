import { Command, CommandProps } from '@libs/ddd';

export class CalculateTariffCommand extends Command {
  // Add more properties here
  readonly compCode: string;
  readonly operationCode: string;
  readonly locCode?: string | null;
  readonly damCode?: string | null;
  readonly repCode: string;
  readonly length: number;
  readonly width: number;
  readonly quantity: number;

  constructor(props: CommandProps<CalculateTariffCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
