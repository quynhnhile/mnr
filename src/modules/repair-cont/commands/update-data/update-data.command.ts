import { Command, CommandProps } from '@libs/ddd';

type UpdateDataItemProps = {
  id: number;
  conditionCode?: string;
  statusCode?: string;
  classifyCode?: string;
  estimateDate?: Date;
  estimateBy?: string;
  approvalDate?: Date;
  approvalBy?: string;
  completeDate?: Date;
  completeBy?: string;
  noteEstimate?: string;
  updatedBy: string;
};

export class UpdateDataCommand extends Command {
  readonly dataUpdate: UpdateDataItemProps[];

  constructor(
    props: CommandProps<{
      dataUpdate: UpdateDataItemProps[];
    }>,
  ) {
    super(props);
    this.dataUpdate = props.dataUpdate;
  }
}
