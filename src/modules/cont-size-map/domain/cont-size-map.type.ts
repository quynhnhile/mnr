import { Prisma } from '@prisma/client';

export interface ContSizeMapProps {
  id?: string;
  operationCode: string;
  localSizeType: string;
  isoSizeType: string;
  size?: string | null;
  height?: Prisma.Decimal | null;
  contType?: string | null;
  contTypeName?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateContSizeMapProps {
  operationCode: string;
  localSizeType: string;
  isoSizeType: string;
  size?: string;
  height?: Prisma.Decimal;
  contType?: string;
  contTypeName?: string;
  createdBy: string;
}

export interface UpdateContSizeMapProps {
  operationCode?: string;
  localSizeType?: string;
  isoSizeType?: string;
  size?: string;
  height?: Prisma.Decimal;
  contType?: string;
  contTypeName?: string;
  updatedBy: string;
}
