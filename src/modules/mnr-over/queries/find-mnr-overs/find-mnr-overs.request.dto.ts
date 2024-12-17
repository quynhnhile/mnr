import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindMnrOversRequestDto extends FilterDto<Prisma.ConfigMnROverWhereInput> {
  // Add more properties here
}
