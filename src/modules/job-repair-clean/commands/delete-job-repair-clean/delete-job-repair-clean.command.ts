export class DeleteJobRepairCleanCommand {
  readonly jobRepairCleanId: bigint;

  constructor(props: DeleteJobRepairCleanCommand) {
    this.jobRepairCleanId = props.jobRepairCleanId;
  }
}
