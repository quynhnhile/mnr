import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStatusTypeRequestDto {
  @ApiProperty({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI', // SURVEY | ESTIMATE | REPAIR | REVERSE-E | REVERSE-R | PTI
  })
  @IsNotEmpty()
  @MaxLength(50)
  statusTypeCode: string;

  @ApiProperty({
    example: 'SỬA CHỮA',
    description: 'TÊN LOẠI TRẠNG THÁI', // Báo giá | Vệ Sinh | Sửa chữa | Đảo giám định báo giá | Đảo giám định sửa chữa | PTI
  })
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
