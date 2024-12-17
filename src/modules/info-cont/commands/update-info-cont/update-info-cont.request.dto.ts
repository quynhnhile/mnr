import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInfoContRequestDto {
  @ApiProperty({
    example: 'SỐ CONT',
    description: 'SỐ CONT',
  })
  @IsString()
  @MaxLength(11)
  containerNo: string;

  @ApiProperty({
    example: 'HÃNG TÀU',
    description: 'HÃNG TÀU',
  })
  @IsString()
  @MaxLength(20)
  operationCode: string;

  @ApiPropertyOptional({
    example: 'CHỦ CONT',
    description: 'CHỦ CONT',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ownerCode?: string;

  @ApiPropertyOptional({
    example: 'kcnb',
    description: 'KÍCH CỠ NỘI BỘ',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  localSizeType?: string;

  @ApiPropertyOptional({
    example: 'kc-iso',
    description: 'KÍCH CỠ ISO',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  isoSizeType?: string;

  @ApiPropertyOptional({
    example: 'TANK',
    description: 'LOẠI CONT: DRY | REEFER | TANK',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  contType?: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT VỎ',
  })
  @IsNotEmpty()
  contAge?: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT MÁY',
  })
  @IsOptional()
  machineAge?: string;

  @ApiPropertyOptional({
    example: 'HÃNG MÁY',
    description: 'HÃNG MÁY',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  machineBrand?: string;

  @ApiPropertyOptional({
    example: 'ĐỜI MÁY',
    description: 'ĐỜI MÁY',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  machineModel?: string;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG VỎ',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'tareWeight must be a number with up to 2 decimal places.' },
  )
  tareWeight?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG TỐI ĐA',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'maxGrossWeight must be a number with up to 2 decimal places.' },
  )
  maxGrossWeight?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG TỊNH',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'net must be a number with up to 2 decimal places.' },
  )
  net?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'SỨC CHỨA',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'capacity must be a number with up to 2 decimal places.' },
  )
  capacity?: number;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  lastTest?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'LOẠI A VÀ H',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  typeTest?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
