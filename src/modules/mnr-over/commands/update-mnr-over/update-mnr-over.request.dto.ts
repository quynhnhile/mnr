import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateMnrOverRequestDto {
  @ApiPropertyOptional({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI', // SURVEY | ESTIMATE | REPAIR | REVERSE-E | REVERSE-R | PTI
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  statusTypeCode: string;

  @ApiPropertyOptional({
    example: 'ALL',
    description: 'LOẠI CONT', // All | Dry | Tank | Reefer
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  contType: string;

  @ApiPropertyOptional({
    example: 'HẠ BÃI ĐƯỜNG BỘ',
    description: 'PHƯƠNG ÁN CÔNG VIỆC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  jobModeCode: string;

  @ApiPropertyOptional({
    example: 'BÃI - XE',
    description: 'PHƯƠNG THỨC GIAO NHẬN',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  methodCode: string;

  @ApiPropertyOptional({
    example: 'NGÀY VÀO BÃI', // Ngày vào bãi | Ngày thực hiện PTI | Ngày hoàn tất PTI
    description: 'MỐC THỜI GIAN BẮT ĐẦU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  startDate: string;

  @ApiPropertyOptional({
    example: 'NGÀY BÁO GIÁ',
    description: 'MỐC THỜI GIAN KẾT THÚC',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  endDate: string;

  @ApiPropertyOptional({
    example: 'CÓ KẾ HOẠCH PTI', // Có kế hoạch PTI | PTI tự động
    description: 'PTI',
  })
  @IsOptional()
  pti?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'TỪ SỐ (TEU)',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  from: number;

  @ApiPropertyOptional({
    example: 300,
    description: 'ĐẾN SỐ (TEU)',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  to: number;

  @ApiPropertyOptional({
    example: 'TEU', // TEU | CONT
    description: 'ĐƠN VỊ TÍNH',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  unit: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'SỐ NGÀY CHO PHÉP',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
