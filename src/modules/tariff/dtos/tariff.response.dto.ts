import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TariffUnit } from '../domain/tariff.type';

export class TariffResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'TRF001',
    description: 'Mã nhóm biểu cước',
  })
  groupTrfCode: string;

  @ApiProperty({
    example: 'COMP001',
    description: 'Mã bộ phận cont',
  })
  compCode: string;

  @ApiProperty({
    example: ['LOC001'],
    description: 'Mã vị trí bộ phận cont',
    type: 'string',
    isArray: true,
  })
  locCode: string[];

  @ApiPropertyOptional({
    example: 'DAM001',
    description: 'Mã loại hư hỏng cont',
  })
  damCode?: string;

  @ApiProperty({
    example: 'REP001',
    description: 'Mã sửa chữa cont',
  })
  repCode: string;

  @ApiProperty({
    example: 12,
    description: 'Chiều dài',
  })
  length: number;

  @ApiProperty({
    example: 12,
    description: 'Chiều rộng',
  })
  width: number;

  @ApiProperty({
    example: 'Q',
    description: 'Đơn vị tính',
    enum: TariffUnit,
  })
  unit: string;

  @ApiProperty({
    example: 1,
    description: 'Số lượng',
  })
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'Số giờ',
  })
  hours: number;

  @ApiProperty({
    example: 'VND',
    description: 'Tiền tệ',
  })
  currency: string;

  @ApiProperty({
    example: 1_000_000,
    description: 'Đơn giá',
  })
  mateAmount: number;

  @ApiProperty({
    example: 1_000_000,
    description: 'Tổng tiền',
  })
  totalAmount: number;

  @ApiPropertyOptional({
    example: 0.1,
    description: 'Thuế VAT (%)',
  })
  vat?: number | null;

  @ApiProperty({
    example: false,
    description: 'Bao gồm VAT',
  })
  includeVat: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Cách tính đơn giá theo bước nhảy',
  })
  add?: number | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thêm giờ - Mô tả công thức tính Add Hours',
  })
  addHours?: number | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'Thêm đơn giá Material - Mô tả công thức tính Add Material',
  })
  addMate?: number | null;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'Ghi chú diễn giải biểu cước',
  })
  note?: string | null;
}
