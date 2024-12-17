import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTerminalRequestDto {
  @ApiProperty({
    example: '',
    description: 'MÃ VÙNG MIỀN',
  })
  @IsNotEmpty()
  @MaxLength(50)
  regionCode: string;

  @ApiProperty({
    example: '',
    description: 'MÃ ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  @IsNotEmpty()
  @MaxLength(50)
  terminalCode: string;

  @ApiProperty({
    example: '',
    description: 'TÊN ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  @IsNotEmpty()
  @MaxLength(100)
  terminalName: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN TIẾNG ANH',
  })
  @IsOptional()
  @MaxLength(100)
  terminalNameEng?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ĐỊA CHỈ',
  })
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'MÃ SỐ THUẾ',
  })
  @IsOptional()
  @MaxLength(50)
  vat?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'EMAIL',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ĐIỆN THOẠI',
  })
  @IsOptional()
  @MaxLength(100)
  tel?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'FAX',
  })
  @IsOptional()
  @MaxLength(100)
  fax?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'LINK WEB',
  })
  @IsOptional()
  @MaxLength(200)
  web?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'HOTLINE',
  })
  @IsOptional()
  @MaxLength(100)
  hotlineInfo?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'logo.png',
  })
  @IsOptional()
  @MaxLength(100)
  logoText?: string;

  @ApiPropertyOptional({
    example: null,
    description: '<img src = " ">',
  })
  @IsOptional()
  logoHtml?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(200)
  contactName?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'TÊN NHÓM LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(200)
  contactGroupName?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'SỐ ĐIỆN THOẠI LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(100)
  contactTel?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ZALO LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(100)
  contactZaloId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'FACEBOOK LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(100)
  contactFbId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'EMAIL LIÊN HỆ',
  })
  @IsOptional()
  @MaxLength(100)
  contactEmail?: string;

  @ApiProperty({
    example: true,
    description: 'TRẠNG THÁI',
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'Ghi chú',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
