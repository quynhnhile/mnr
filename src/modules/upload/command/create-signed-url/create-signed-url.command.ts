import { Command, CommandProps } from '@libs/ddd';

export class CreateSignedUrlCommand extends Command {
  readonly containerNo: string;
  readonly jobTask: string;
  readonly surveyType?: string;
  readonly side: string;
  readonly com?: string;
  readonly loc?: string;
  readonly dam?: string;
  readonly rep?: string;
  readonly length?: string;
  readonly width?: string;
  readonly quantity?: string;
  readonly imageTotal: number;

  constructor(props: CommandProps<CreateSignedUrlCommand>) {
    super(props);
    this.containerNo = props.containerNo;
    this.jobTask = props.jobTask;
    this.surveyType = props.surveyType;
    this.side = props.side;
    this.com = props.com;
    this.loc = props.loc;
    this.dam = props.dam;
    this.rep = props.rep;
    this.length = props.length;
    this.width = props.width;
    this.quantity = props.quantity;
    this.imageTotal = props.imageTotal;
  }
}

// import { Command, CommandProps } from '@libs/ddd';

// export class CreateSignedUrlCommand extends Command {
//   readonly containerNo: string;
//   readonly jobTask: string;
//   readonly surveyType?: string;
//   readonly side: string;
//   readonly com?: string;
//   readonly loc?: string;
//   readonly rep?: string;
//   readonly imageTotal: number;

//   constructor(props: CommandProps<CreateSignedUrlCommand>) {
//     super(props);
//     this.containerNo = props.containerNo;
//     this.jobTask = props.jobTask;
//     this.surveyType = props.surveyType;
//     this.side = props.side;
//     this.com = props.com;
//     this.loc = props.loc;
//     this.rep = props.rep;
//     this.imageTotal = props.imageTotal;
//   }
// }
