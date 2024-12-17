import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDamageLocalRequestDto {
  @ApiProperty({
    example: 'PT',
    description: 'MÃ HƯ HỎNG NỘI BỘ CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  damLocalCode: string;

  @ApiProperty({
    example: 'PATCHING',
    description: 'TÊN TIẾNG ANH',
  })
  @IsNotEmpty()
  @MaxLength(200)
  damLocalNameEn: string;

  @ApiPropertyOptional({
    example: 'VÁ ĐẮP',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  damLocalNameVi?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
