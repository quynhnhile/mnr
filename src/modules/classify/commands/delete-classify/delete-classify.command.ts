export class DeleteClassifyCommand {
  readonly classifyId: bigint;

  constructor(props: DeleteClassifyCommand) {
    this.classifyId = props.classifyId;
  }
}
