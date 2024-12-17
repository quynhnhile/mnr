import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepairContRequestDto {
  @ApiProperty({
    example: 'NSSU7117749',
    description: 'ID CONTAINER',
  })
  @IsNotEmpty()
  @MaxLength(50)
  idCont: string;

  @ApiPropertyOptional({
    example: 'NDV24062503584-003',
    description: 'MÃ PIN',
  })
  @IsOptional()
  @MaxLength(25)
  pinCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ ORDER',
  })
  @IsOptional()
  @MaxLength(50)
  orderNo?: string;

  @ApiPropertyOptional({
    example: 'B',
    description: 'MÃ TÌNH TRẠNG CONTAINER SAU GIÁM ĐỊNH',
  })
  @IsOptional()
  @MaxLength(50)
  conditionCodeAfter?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ TÌNH TRẠNG MÁY SAU GIÁM ĐỊNH',
  })
  @IsOptional()
  @MaxLength(50)
  conditionMachineCodeAfter?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'NGÀY CONTAINER VÀO KV SỬA CHỮA/VS',
  })
  @IsOptional()
  @IsDateString()
  factoryDate?: Date;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY IN',
  })
  @IsOptional()
  @MaxLength(50)
  surveyInNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY OUT',
  })
  @IsOptional()
  @MaxLength(50)
  surveyOutNo?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'GHI CHÚ',
  })
  @IsOptional()
  note?: string;
}
