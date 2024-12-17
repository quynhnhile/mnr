import { Command, CommandProps } from '@libs/ddd';

export class UpdateTerminalCommand extends Command {
  readonly terminalId: bigint;
  readonly regionCode?: string;
  readonly terminalCode?: string;
  readonly terminalName?: string;
  readonly terminalNameEng?: string;
  readonly address?: string;
  readonly vat?: string;
  readonly email?: string;
  readonly tel?: string;
  readonly fax?: string;
  readonly web?: string;
  readonly hotlineInfo?: string;
  readonly logoText?: string;
  readonly logoHtml?: string;
  readonly contactName?: string;
  readonly contactGroupName?: string;
  readonly contactTel?: string;
  readonly contactZaloId?: string;
  readonly contactFbId?: string;
  readonly contactEmail?: string;
  readonly isActive?: boolean;
  readonly note?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateTerminalCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
