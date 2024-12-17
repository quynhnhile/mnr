import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindTariffsRequestDto extends FilterDto<Prisma.TariffWhereInput> {
  // Add more properties here
}
