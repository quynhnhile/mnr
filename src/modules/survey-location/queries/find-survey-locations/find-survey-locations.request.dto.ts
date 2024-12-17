import { FilterDto } from '@libs/application/validators/prisma-filter.validator';
import { Prisma } from '@prisma/client';

export class FindSurveyLocationsRequestDto extends FilterDto<Prisma.SurveyLocationWhereInput> {
  // Add more properties here
}
