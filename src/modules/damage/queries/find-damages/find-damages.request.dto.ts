import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindDamagesRequestDto extends FilterDto<Prisma.DamageWhereInput> {}
