import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindTariffGroupsRequestDto extends FilterDto<Prisma.TariffGroupWhereInput> {
  // Add more properties here
}
