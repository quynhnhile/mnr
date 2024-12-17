import { Prisma } from '@prisma/client';
import { FilterDto } from '@src/libs/application/validators/prisma-filter.validator';

export class FindSysConfigOprsRequestDto extends FilterDto<Prisma.SysConfigOprWhereInput> {
  // Add more properties here
}
