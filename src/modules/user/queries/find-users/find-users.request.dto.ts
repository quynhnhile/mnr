import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PaginatedQueryRequestDto } from '@libs/api/paginated-query.request.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersRequestDto extends PaginatedQueryRequestDto {
  @ApiPropertyOptional({
    example: 'France',
    description: 'Country of residence',
  })
  @IsOptional()
  @MaxLength(50)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly country?: string;

  @ApiPropertyOptional({
    example: '28566',
    description: 'Postal code',
  })
  @IsOptional()
  @MaxLength(10)
  @IsAlphanumeric()
  readonly postalCode?: string;

  @ApiPropertyOptional({
    example: 'Grande Rue',
    description: 'Street',
  })
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[a-zA-Z ]*$/)
  readonly street?: string;
}
