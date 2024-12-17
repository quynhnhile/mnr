import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateTerminalRequestDto {
  @ApiPropertyOptional({
    example: '',
    description: 'MÃ VÙNG MIỀN',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  regionCode: string;

  @ApiPropertyOptional({
    example: '',
    description: 'MÃ ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  terminalCode: string;

  @ApiPropertyOptional({
    example: '',
    description: 'TÊN ĐƠN VỊ CẢNG / DEPOT / ICD',
  })
  @IsOptionalNonNullable()
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
  @IsEmail()
  @MaxLength(100)
  contactEmail?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'TRẠNG THÁI',
  })
  @IsOptionalNonNullable()
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
