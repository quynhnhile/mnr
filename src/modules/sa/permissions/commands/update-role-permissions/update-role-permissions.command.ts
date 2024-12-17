import { Command, CommandProps } from '@libs/ddd';
import { RolePermissionsDto } from './update-role-permissions.request.dto';

export class UpdateRolePermissionsCommand extends Command {
  readonly roleName: string;
  readonly resources: RolePermissionsDto[];

  constructor(props: CommandProps<UpdateRolePermissionsCommand>) {
    super(props);
    this.roleName = props.roleName;
    this.resources = props.resources;
  }
}
