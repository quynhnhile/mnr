import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMnrOverRequestDto {
  @ApiProperty({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI', // SURVEY | ESTIMATE | REPAIR | REVERSE-E | REVERSE-R | PTI
  })
  @IsNotEmpty()
  @MaxLength(50)
  statusTypeCode: string;

  @ApiProperty({
    example: 'ALL',
    description: 'LOẠI CONT', // All | Dry | Tank | Reefer
  })
  @IsNotEmpty()
  @MaxLength(50)
  contType: string;

  @ApiProperty({
    example: 'HẠ BÃI ĐƯỜNG BỘ',
    description: 'PHƯƠNG ÁN CÔNG VIỆC',
  })
  @IsNotEmpty()
  @MaxLength(50)
  jobModeCode: string;

  @ApiProperty({
    example: 'BÃI - XE',
    description: 'PHƯƠNG THỨC GIAO NHẬN',
  })
  @IsNotEmpty()
  @MaxLength(50)
  methodCode: string;

  @ApiProperty({
    example: 'NGÀY VÀO BÃI', // Ngày vào bãi | Ngày thực hiện PTI | Ngày hoàn tất PTI
    description: 'MỐC THỜI GIAN BẮT ĐẦU',
  })
  @IsNotEmpty()
  @MaxLength(50)
  startDate: string;

  @ApiProperty({
    example: 'NGÀY BÁO GIÁ',
    description: 'MỐC THỜI GIAN KẾT THÚC',
  })
  @IsNotEmpty()
  @MaxLength(50)
  endDate: string;

  @ApiPropertyOptional({
    example: 'CÓ KẾ HOẠCH PTI', // Có kế hoạch PTI | PTI tự động
    description: 'PTI',
  })
  @IsOptional()
  pti?: string;

  @ApiProperty({
    example: 0,
    description: 'TỪ SỐ (TEU)',
  })
  @IsNotEmpty()
  @IsNumber()
  from: number;

  @ApiProperty({
    example: 300,
    description: 'ĐẾN SỐ (TEU)',
  })
  @IsNotEmpty()
  @IsNumber()
  to: number;

  @ApiProperty({
    example: 'TEU', // TEU | CONT
    description: 'ĐƠN VỊ TÍNH',
  })
  @IsNotEmpty()
  @MaxLength(50)
  unit: string;

  @ApiProperty({
    example: 5,
    description: 'SỐ NGÀY CHO PHÉP',
  })
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
