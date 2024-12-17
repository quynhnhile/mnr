import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MnrOverResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'REPAIR',
    description: 'MÃ LOẠI TRẠNG THÁI', // SURVEY | ESTIMATE | REPAIR | REVERSE-E | REVERSE-R | PTI
  })
  statusTypeCode: string;

  @ApiProperty({
    example: 'ALL',
    description: 'LOẠI CONT', // All | Dry | Tank | Reefer
  })
  contType: string;

  @ApiProperty({
    example: 'HẠ BÃI ĐƯỜNG BỘ',
    description: 'PHƯƠNG ÁN CÔNG VIỆC',
  })
  jobModeCode: string;

  @ApiProperty({
    example: 'BÃI - XE',
    description: 'PHƯƠNG THỨC GIAO NHẬN',
  })
  methodCode: string;

  @ApiProperty({
    example: 'NGÀY VÀO BÃI', // Ngày vào bãi | Ngày thực hiện PTI | Ngày hoàn tất PTI
    description: 'MỐC THỜI GIAN BẮT ĐẦU',
  })
  startDate: string;

  @ApiProperty({
    example: 'NGÀY BÁO GIÁ',
    description: 'MỐC THỜI GIAN KẾT THÚC',
  })
  endDate: string;

  @ApiPropertyOptional({
    example: 'CÓ KẾ HOẠCH PTI', // Có kế hoạch PTI | PTI tự động
    description: 'PTI',
  })
  pti?: string;

  @ApiProperty({
    example: 0,
    description: 'TỪ SỐ (TEU)',
  })
  from: number;

  @ApiProperty({
    example: 300,
    description: 'ĐẾN SỐ (TEU)',
  })
  to: number;

  @ApiProperty({
    example: 'TEU', // TEU | CONT
    description: 'ĐƠN VỊ TÍNH',
  })
  unit: string;

  @ApiProperty({
    example: 5,
    description: 'SỐ NGÀY CHO PHÉP',
  })
  quantity: number;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  note?: string;
}
