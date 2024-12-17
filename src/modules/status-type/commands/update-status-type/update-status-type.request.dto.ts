import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusTypeRequestDto {
  @ApiPropertyOptional({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI', // SURVEY | ESTIMATE | REPAIR | REVERSE-E | REVERSE-R | PTI
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  statusTypeCode: string;

  @ApiPropertyOptional({
    example: 'SỬA CHỮA',
    description: 'TÊN LOẠI TRẠNG THÁI', // Báo giá | Vệ Sinh | Sửa chữa | Đảo giám định báo giá | Đảo giám định sửa chữa | PTI
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  statusTypeName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
