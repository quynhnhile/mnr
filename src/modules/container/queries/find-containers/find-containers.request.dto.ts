import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindContainersRequestDto extends FilterDto<Prisma.ContainerWhereInput> {}