import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDamageRequestDto {
  @ApiPropertyOptional({
    example: 'HLC',
    description: 'MÃ HÃNG TÀU',
  })
  @MaxLength(50)
  @IsOptional()
  operationCode?: string;

  @ApiProperty({
    example: 'PT',
    description: 'MÃ HƯ HỎNG CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  damCode: string;

  @ApiProperty({
    example: 'PATCHING',
    description: 'TÊN TIẾNG ANH',
  })
  @IsNotEmpty()
  @MaxLength(200)
  damNameEn: string;

  @ApiPropertyOptional({
    example: 'VÁ ĐẮP',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  damNameVi?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
