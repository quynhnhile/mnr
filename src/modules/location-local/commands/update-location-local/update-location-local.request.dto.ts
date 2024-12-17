import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateLocationLocalRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Nhóm mã vị trí nội bộ container',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  groupLocLocalCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Mã vị trí nội bộ container',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  locLocalCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Tên tiếng anh',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(500)
  locLocalNameEn?: string;

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
