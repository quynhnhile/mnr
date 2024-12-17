import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateEstimateRequestDto {
  @ApiPropertyOptional({
    example: '202409186859',
    description: 'ESTIMATE NO - ALT',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  altEstimateNo?: string;

  @ApiPropertyOptional({
    example: 'estimate note',
    description: 'NOTE ESTIMATE',
  })
  @IsOptional()
  noteEstimate?: string;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  @IsOptional()
  note?: string;
}
