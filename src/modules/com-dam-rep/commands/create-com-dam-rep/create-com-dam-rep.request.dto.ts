import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComDamRepRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'PSC',
    description: 'MÃ BỘ PHẬN CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  compCode: string;

  @ApiProperty({
    example: 'CT',
    description: 'MÃ HƯ HỎNG',
  })
  @IsNotEmpty()
  @MaxLength(50)
  damCode: string;

  @ApiProperty({
    example: 'LT',
    description: 'MÃ SỬA CHỮA',
  })
  @IsNotEmpty()
  @MaxLength(50)
  repCode: string;

  @ApiProperty({
    example: 'PANEL - LEFT SIDE ROOF OR TOP LT - CONTAMINATED',
    description: 'TÊN TIẾNG ANH',
  })
  @IsNotEmpty()
  @MaxLength(200)
  nameEn: string;

  @ApiPropertyOptional({
    example: 'VÁCH - TRÁI NÓC LT - DƠ BẨN TẠO VẾT',
    description: 'TÊN TIẾNG VIỆT',
  })
  @IsOptional()
  @MaxLength(200)
  nameVi?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ COM_DAM_REP',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
