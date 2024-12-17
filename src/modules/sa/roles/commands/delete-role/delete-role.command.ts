export class DeleteRoleCommand {
  readonly roleName: string;

  constructor(props: DeleteRoleCommand) {
    this.roleName = props.roleName;
  }
}
