import { Command, CommandProps } from '@libs/ddd';

type UpdateConditionClassifyCodeItemProps = {
  id: number;
  conditionCode?: string;
  classifyCode?: string;
  updatedBy: string;
};

export class UpdateConditionClassifyCodeCommand extends Command {
  readonly dataUpdate: UpdateConditionClassifyCodeItemProps[];

  constructor(
    props: CommandProps<{
      dataUpdate: UpdateConditionClassifyCodeItemProps[];
    }>,
  ) {
    super(props);
    this.dataUpdate = props.dataUpdate;
  }
}
