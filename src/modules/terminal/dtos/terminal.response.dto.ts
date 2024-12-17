import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TerminalResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: 'MÃ VÙNG MIỀN',
  })
  regionCode: string;

  @ApiProperty({
    example: '',
    description: 'MÃ ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  terminalCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  terminalName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN TIẾNG ANH',
  })
  terminalNameEng?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ĐỊA CHỈ',
  })
  address?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'MÃ SỐ THUẾ',
  })
  vat?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'EMAIL',
  })
  email?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ĐIỆN THOẠI',
  })
  tel?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'FAX',
  })
  fax?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'LINK WEB',
  })
  web?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'HOTLINE',
  })
  hotlineInfo?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'logo.png',
  })
  logoText?: string;

  @ApiPropertyOptional({
    example: null,
    description: '<img src = " ">',
  })
  logoHtml?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN LIÊN HỆ',
  })
  contactName?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN NHÓM LIÊN HỆ',
  })
  contactGroupName?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'SỐ ĐIỆN THOẠI LIÊN HỆ',
  })
  contactTel?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ZALO LIÊN HỆ',
  })
  contactZaloId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'FACEBOOK LIÊN HỆ',
  })
  contactFbId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'EMAIL LIÊN HỆ',
  })
  contactEmail?: string;

  @ApiProperty({
    example: true,
    description: 'TRẠNG THÁI',
  })
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  note?: string;
}
