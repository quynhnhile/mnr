export class DeleteJobTaskCommand {
  readonly jobTaskId: bigint;

  constructor(props: DeleteJobTaskCommand) {
    this.jobTaskId = props.jobTaskId;
  }
}
