import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindEstimateDetailsStartableRequestDto extends FilterDto<Prisma.EstimateDetailWhereInput> {
  // Add more properties here
}
