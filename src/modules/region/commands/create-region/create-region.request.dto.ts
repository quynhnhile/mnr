import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegionRequestDto {
  @ApiProperty({
    example: 'S',
    description: 'MÃ VÙNG MIỀN',
  })
  @IsNotEmpty()
  @MaxLength(50)
  regionCode: string;

  @ApiProperty({
    example: 'Miền Nam',
    description: 'TÊN VÙNG MIỀN',
  })
  @IsNotEmpty()
  regionName: string;

  @ApiPropertyOptional({
    example: 'Miền Nam',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
