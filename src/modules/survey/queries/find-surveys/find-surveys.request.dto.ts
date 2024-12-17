import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindSurveysRequestDto extends FilterDto<Prisma.SurveyWhereInput> {
  // Add more properties here
}
