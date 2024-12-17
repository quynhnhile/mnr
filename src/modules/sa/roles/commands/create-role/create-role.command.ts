import { Command, CommandProps } from '@libs/ddd';

export class CreateRoleCommand extends Command {
  readonly roleName: string;
  readonly description?: string;

  constructor(props: CommandProps<CreateRoleCommand>) {
    super(props);
    this.roleName = props.roleName;
    this.description = props.description;
  }
}
