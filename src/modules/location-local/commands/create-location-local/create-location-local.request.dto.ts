import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationLocalRequestDto {
  @ApiProperty({
    example: '',
    description: 'Nhóm mã vị trí nội bộ container',
  })
  @IsNotEmpty()
  @MaxLength(50)
  groupLocLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Mã vị trí nội bộ container',
  })
  @IsNotEmpty()
  @MaxLength(50)
  locLocalCode: string;

  @ApiProperty({
    example: '',
    description: 'Tên tiếng anh',
  })
  @IsNotEmpty()
  @MaxLength(500)
  locLocalNameEn: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Tên tiếng việt',
  })
  @IsOptional()
  @MaxLength(500)
  locLocalNameVi?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string;
}
