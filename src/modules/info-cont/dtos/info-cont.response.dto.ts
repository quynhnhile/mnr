import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InfoContResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'SỐ CONT',
    description: 'SỐ CONT',
  })
  containerNo: string;

  @ApiProperty({
    example: 'HÃNG TÀU',
    description: 'HÃNG TÀU',
  })
  operationCode: string;

  @ApiPropertyOptional({
    example: 'CHỦ CONT',
    description: 'CHỦ CONT',
  })
  ownerCode?: string;

  @ApiProperty({
    example: 'kcnb',
    description: 'KÍCH CỠ NỘI BỘ',
  })
  localSizeType: string;

  @ApiProperty({
    example: 'kc-iso',
    description: 'KÍCH CỠ ISO',
  })
  isoSizeType: string;

  @ApiProperty({
    example: 'TANK',
    description: 'LOẠI CONT: DRY | REEFER | TANK',
  })
  contType: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT VỎ',
  })
  contAge?: string;

  @ApiPropertyOptional({
    example: '2000',
    description: 'NĂM SẢN XUẤT MÁY',
  })
  machineAge?: string;

  @ApiPropertyOptional({
    example: 'HÃNG MÁY',
    description: 'HÃNG MÁY',
  })
  machineBrand?: string;

  @ApiPropertyOptional({
    example: 'ĐỜI MÁY',
    description: 'ĐỜI MÁY',
  })
  machineModel?: string;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG VỎ',
  })
  tareWeight?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG TỐI ĐA',
  })
  maxGrossWeight?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'TRỌNG LƯỢNG TỊNH',
  })
  net?: number;

  @ApiPropertyOptional({
    example: 666,
    description: 'SỨC CHỨA',
  })
  capacity?: number;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  lastTest?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'LOẠI A VÀ H',
  })
  typeTest?: string;

  @ApiPropertyOptional({
    example: 'GHI CHÚ',
    description: 'GHI CHÚ',
  })
  note?: string;
}
