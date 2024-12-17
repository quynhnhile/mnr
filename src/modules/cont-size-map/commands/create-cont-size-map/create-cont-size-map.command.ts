import { Command, CommandProps } from '@libs/ddd';
import { Prisma } from '@prisma/client';

export class CreateContSizeMapCommand extends Command {
  readonly operationCode: string;
  readonly localSizeType: string;
  readonly isoSizeType: string;
  readonly size?: string;
  readonly height?: Prisma.Decimal;
  readonly contType?: string;
  readonly contTypeName?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateContSizeMapCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
