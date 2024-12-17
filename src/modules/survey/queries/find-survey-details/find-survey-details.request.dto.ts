import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindSurveyDetailsRequestDto extends FilterDto<Prisma.SurveyDetailWhereInput> {
  // Add more properties here
}
