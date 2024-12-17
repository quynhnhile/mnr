import { IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptionalNonNullable } from '@src/libs/decorators/class-validator.decorator';

export class UpdateSysConfigOprRequestDto {
  @ApiPropertyOptional({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
  @IsOptionalNonNullable()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiPropertyOptional({
    example: 'chính sách hãng tàu',
    description: 'CHÍNH SÁCH HÃNG TÀU',
  })
  @IsOptional()
  @MaxLength(500)
  policyInfo?: string;

  @ApiPropertyOptional({
    example: 1.5,
    description: 'Phần trăm tăng giảm tiền cược',
  })
  @IsOptional()
  @Min(0)
  discountRate?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Số tiền cược',
  })
  @IsOptional()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  @IsOptional()
  note?: string;
}
