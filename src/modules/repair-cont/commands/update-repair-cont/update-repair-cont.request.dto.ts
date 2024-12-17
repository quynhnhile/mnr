import { IsDateString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateRepairContRequestDto {
  @ApiPropertyOptional({
    example: 'NDV24062503584-003',
    description: 'MÃ PIN',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @MaxLength(25)
  pinCode?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ ORDER',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @MaxLength(50)
  orderNo?: string;

  @ApiPropertyOptional({
    example: 'B',
    description: 'MÃ TÌNH TRẠNG CONTAINER SAU GIÁM ĐỊNH',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @MaxLength(50)
  conditionCodeAfter?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'MÃ TÌNH TRẠNG MÁY SAU GIÁM ĐỊNH',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @MaxLength(50)
  conditionMachineCodeAfter?: string;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'NGÀY CONTAINER VÀO KV SỬA CHỮA/VS',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @IsDateString()
  factoryDate?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'NGÀY HOÀN THÀNH SỬA CHỮA/VS',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @IsDateString()
  completeDate?: Date;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY IN',
  })
  @IsOptionalNonNullable()
  @IsOptional()
  @MaxLength(50)
  surveyInNo?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'SỐ SURVEY OUT',
  })
  @IsOptionalNonNullable()
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
