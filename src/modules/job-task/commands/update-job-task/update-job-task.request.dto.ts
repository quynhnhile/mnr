import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateJobTaskRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: '',
    description: 'MÃ TÁC NGHIỆP',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  jobTaskCode: string;

  @ApiPropertyOptional({
    example: '',
    description: 'TÊN TÁC NGHIỆP',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(100)
  jobTaskName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
