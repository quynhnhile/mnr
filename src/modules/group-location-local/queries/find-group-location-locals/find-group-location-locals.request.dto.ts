import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindGroupLocationLocalsRequestDto extends FilterDto<Prisma.GroupLocationLocalWhereInput> {
  // Add more properties here
}
