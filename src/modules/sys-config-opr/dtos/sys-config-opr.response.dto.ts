import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SysConfigOprResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiPropertyOptional({
    example: 'chính sách 123',
    description: 'CHÍNH SÁCH HÃNG TÀU',
  })
  policyInfo?: string | null;

  @ApiPropertyOptional({
    example: 1.5,
    description: 'Phần trăm tăng giảm tiền cược',
  })
  discountRate?: number | null;

  @ApiPropertyOptional({
    example: 150,
    description: 'Số tiền cược',
  })
  amount?: number | null;

  @ApiPropertyOptional({
    example: 'note 123',
    description: 'NOTE',
  })
  note?: string;
}
