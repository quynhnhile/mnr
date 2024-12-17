import { Command, CommandProps } from '@libs/ddd';
import { Prisma } from '@prisma/client';

export class UpdateContSizeMapCommand extends Command {
  readonly contSizeMapId: bigint;
  readonly operationCode?: string;
  readonly localSizeType?: string;
  readonly isoSizeType?: string;
  readonly size?: string;
  readonly height?: Prisma.Decimal;
  readonly contType?: string;
  readonly contTypeName?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateContSizeMapCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
