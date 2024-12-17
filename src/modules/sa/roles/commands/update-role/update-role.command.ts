import { Command, CommandProps } from '@libs/ddd';

export class UpdateRoleCommand extends Command {
  readonly roleName: string;
  readonly description?: string;

  constructor(props: CommandProps<UpdateRoleCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
