import { PaginatedQueryRequestDto } from '@libs/api/paginated-query.request.dto';
import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindConditionsRequestDto extends FilterDto<Prisma.ConditionWhereInput> {}
