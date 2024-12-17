import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobTaskRequestDto {
  // Add more properties here
  @ApiProperty({
    example: '',
    description: 'MÃ TÁC NGHIỆP',
  })
  @IsNotEmpty()
  @MaxLength(50)
  jobTaskCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN TÁC NGHIỆP',
  })
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
