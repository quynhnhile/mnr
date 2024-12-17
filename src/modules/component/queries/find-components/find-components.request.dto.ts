import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindComponentsRequestDto extends FilterDto<Prisma.ComponentWhereInput> {
  // Add more properties here
}
