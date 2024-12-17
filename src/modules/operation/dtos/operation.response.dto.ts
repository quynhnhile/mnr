import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperationResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'ZIM',
    description: 'MÃ HÃNG TÀU',
  })
  operationCode: string;

  @ApiProperty({
    example: 'Zim Integrated Shipping Services Ltd',
    description: 'TÊN HÃNG TÀU',
  })
  operationName: string;

  // @ApiProperty({
  //   example: false,
  //   description: 'GIAO DỊCH EDO',
  // })
  // isEdo: boolean;

  // @ApiProperty({
  //   example: OperationType.FOREIGN,
  //   description: 'GIAO DỊCH LF',
  // })
  // isLocalForeign: OperationType;

  @ApiProperty({
    example: true,
    description: 'KÍCH HOẠT',
  })
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'chính sách 123',
    description: 'CHÍNH SÁCH HÃNG TÀU',
  })
  policyInfo?: string;

  @ApiPropertyOptional({
    example: 'VSHT',
    description: 'PHƯƠNG THỨC VỆ SINH',
  })
  cleanMethodCode?: string;

  // @ApiPropertyOptional({
  //   example: 'M',
  //   description: 'PHƯƠNG THỨC THANH TOÁN',
  // })
  // moneyCredit?: string;
}
