export class DeleteUserCommand {
  readonly userId: string;

  constructor(props: DeleteUserCommand) {
    this.userId = props.userId;
  }
}
