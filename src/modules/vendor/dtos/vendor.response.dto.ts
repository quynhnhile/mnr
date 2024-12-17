import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VendorResponseDto extends ResponseBase<any> {
  @ApiPropertyOptional({
    example: 'S',
    description: 'MÃ HÃNG KHAI KHÁC',
  })
  operationCode?: string;

  @ApiProperty({
    example: 'D',
    description: 'MÃ LOẠI BIỂU CƯỚC',
  })
  vendorTypeCode: string;

  @ApiProperty({
    example: 'SD',
    description: 'MÃ NHÓM BIỂU CƯỚC',
  })
  vendorCode: string;

  @ApiProperty({
    example: 'SNP DELIVERY',
    description: 'TÊN NHÓM BIỂU CƯỚC',
  })
  vendorName: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'TRẠNG THÁI',
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'SNP DELIVERY',
    description: 'GHI CHÚ',
  })
  note?: string;
}
