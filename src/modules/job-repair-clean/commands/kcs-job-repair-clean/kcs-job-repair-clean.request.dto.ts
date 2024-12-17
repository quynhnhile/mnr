import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class KcsJobRepairCleanRequestDto {
  @ApiPropertyOptional({
    example: 0,
    description:
      'KCS STATUS (0: không, 1: đã kiểm tra, 2: yêu cầu sửa chữa lại, 3: yêu cầu kiểm tra báo giá)',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @IsNumber()
  @IsIn([0, 1, 2, 3])
  kcsStatus?: number;

  @ApiPropertyOptional({
    example: 'REASON 123',
    description: 'KCS REASON',
  })
  @IsOptional()
  kcsNote?: string;
}
