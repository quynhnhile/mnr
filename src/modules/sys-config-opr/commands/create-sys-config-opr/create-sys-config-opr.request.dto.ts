import { IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSysConfigOprRequestDto {
  // Add more properties here
  @ApiProperty({
    example: 'MSC',
    description: 'MÃ HÃNG TÀU',
  })
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
