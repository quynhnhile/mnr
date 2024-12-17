import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindComDamRepsRequestDto extends FilterDto<Prisma.ComDamRepWhereInput> {
  // Add more properties here
}
