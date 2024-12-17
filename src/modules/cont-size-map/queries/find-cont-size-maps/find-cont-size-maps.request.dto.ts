import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindContSizeMapsRequestDto extends FilterDto<Prisma.ContSizeMapWhereInput> {}
