import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindStatusTypesRequestDto extends FilterDto<Prisma.StatusTypeWhereInput> {
  // Add more properties here
}
