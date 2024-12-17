import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindLocationLocalsRequestDto extends FilterDto<Prisma.LocationLocalWhereInput> {
  // Add more properties here
}
