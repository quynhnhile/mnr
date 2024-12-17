import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInfoContRequestDto {
  @ApiProperty({
    example: 'SỐ CONT',
    description: 'SỐ CONT',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  containerNo: string;

  @ApiProperty({
    example: 'HÃNG TÀU',
    description: 'HÃNG TÀU',
  })
  @IsNotEmpty()
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

  @ApiProperty({
    example: 'kcnb',
    description: 'KÍCH CỠ NỘI BỘ',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  localSizeType: string;

  @ApiProperty({
    example: '45G0',
    description: 'KÍCH CỠ ISO',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  isoSizeType: string;

  @ApiProperty({
    example: 'TANK',
    description: 'LOẠI CONT: DRY | REEFER | TANK',
  })
  @IsNotEmpty()
  @MaxLength(50)
  contType: string;

  @ApiProperty({
    example: '2000',
    description: 'NĂM SẢN XUẤT VỎ',
  })
  @IsNotEmpty()
  @MaxLength(10)
  contAge: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT MÁY',
  })
  @IsOptional()
  @MaxLength(10)
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
