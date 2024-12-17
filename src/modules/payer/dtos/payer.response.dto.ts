import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class PayerResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: 'O',
    description: 'MÃ TRÁCH NHIỆM',
  })
  payerCode: string;

  @ApiProperty({
    example: 'TRÁCH NHIỆM HÃNG TÀU',
    description: 'ĐƠN VỊ CHỊU TRÁCH NHIỆM',
  })
  payerName: string;

  @ApiProperty({
    example: '',
    description: 'MAPPING MÃ PHÂN LOẠI TRÁCH NHIỆM CỦA TOPOVN/TTOS',
  })
  mappingTos: string;

  @ApiProperty({
    example: 'Hư hỏng do hãng tàu',
    description: 'GHI CHÚ',
  })
  note?: string;
}
