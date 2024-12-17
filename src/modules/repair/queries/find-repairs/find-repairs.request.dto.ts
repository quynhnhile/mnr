import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindRepairsRequestDto extends FilterDto<Prisma.RepairWhereInput> {
  // Add more properties here
}
